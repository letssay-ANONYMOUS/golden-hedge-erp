require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log("Creating user...");
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@goldenhedge.com',
    password: 'SecurePassword123!',
    email_confirm: true,
    user_metadata: { name: 'Admin User' }
  });
  
  if (error) {
    if (error.message.includes('already registered')) {
        console.log("User already exists, attempting to get ID and confirm email...");
        // Since we can't easily get the ID of an existing user via createUser, 
        // we list users to find it
        const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) return console.error("Error listing users:", listError);
        
        const existingUser = usersData.users.find(u => u.email === 'admin@goldenhedge.com');
        if (existingUser) {
            console.log("Found existing user:", existingUser.id);
            // Update email_confirmed_at
            await supabase.auth.admin.updateUserById(existingUser.id, { email_confirm: true });
            
            // Ensure super_admin role
            const { error: profileError } = await supabase.from('users_profile').upsert({
              id: existingUser.id,
              role: 'super_admin',
              first_name: 'Admin',
              last_name: 'User'
            });
            if (profileError) console.error("Error updating profile:", profileError);
            else console.log("Profile role updated successfully.");
        }
    } else {
        console.error("Error creating auth user:", error);
    }
  } else {
    console.log("Created new user:", data.user.id);
    const { error: profileError } = await supabase.from('users_profile').upsert({
      id: data.user.id,
      role: 'super_admin',
      first_name: 'Admin',
      last_name: 'User'
    });
    if (profileError) console.error("Error updating profile:", profileError);
    else console.log("Profile updated successfully.");
  }
}

main();
