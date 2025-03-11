
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts'
import { crypto } from 'https://deno.land/std@0.177.0/crypto/mod.ts'
import { encode as base64Encode, decode as base64Decode } from 'https://deno.land/std@0.177.0/encoding/base64.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, data } = await req.json()

    if (action === 'hash-password') {
      const { password } = data
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      return new Response(
        JSON.stringify({ hash, salt }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'verify-password') {
      const { password, hash } = data
      const isValid = await bcrypt.compare(password, hash)
      return new Response(
        JSON.stringify({ isValid }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'encrypt') {
      const { text, password } = data
      
      // Generate a key from the password
      const encoder = new TextEncoder()
      const passwordData = encoder.encode(password)
      const keyData = await crypto.subtle.digest('SHA-256', passwordData)
      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      )
      
      // Generate an IV
      const iv = crypto.getRandomValues(new Uint8Array(12))
      
      // Encrypt the data
      const textData = encoder.encode(text)
      const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        textData
      )
      
      // Combine the IV and ciphertext and encode as base64
      const combined = new Uint8Array(iv.length + new Uint8Array(ciphertext).length)
      combined.set(iv, 0)
      combined.set(new Uint8Array(ciphertext), iv.length)
      
      return new Response(
        JSON.stringify({ encryptedText: base64Encode(combined) }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'decrypt') {
      const { encryptedText, password } = data
      
      // Generate a key from the password
      const encoder = new TextEncoder()
      const passwordData = encoder.encode(password)
      const keyData = await crypto.subtle.digest('SHA-256', passwordData)
      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      )
      
      // Decode the base64 and separate the IV and ciphertext
      const combined = base64Decode(encryptedText)
      const iv = combined.slice(0, 12)
      const ciphertext = combined.slice(12)
      
      try {
        // Decrypt the data
        const decrypted = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv },
          key,
          ciphertext
        )
        
        const decoder = new TextDecoder()
        return new Response(
          JSON.stringify({ decryptedText: decoder.decode(decrypted) }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (error) {
        return new Response(
          JSON.stringify({ error: 'Decryption failed. Incorrect password.' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
