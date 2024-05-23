

import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
'https://doxrfuapqkmqcgqsvqxa.supabase.co', 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRveHJmdWFwcWttcWNncXN2cXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY0NTkxNTcsImV4cCI6MjAzMjAzNTE1N30.XiHgUghaIbwjFQ4abA6mo8FYOWiFyFe0LoqsTthYtb8')