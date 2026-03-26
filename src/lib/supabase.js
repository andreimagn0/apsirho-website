import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = 'https://hqwxblihyttfzcgkhbmc.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxd3hibGloeXR0ZnpjZ2toYm1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMDYzMjksImV4cCI6MjA4OTg4MjMyOX0.hHX0fGFLDKnss9L-4G_4lpHXHx1adGUlzUoJglTzN3Q';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
