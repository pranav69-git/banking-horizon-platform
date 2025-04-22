
-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.customers (id, name, email, dob, acc_type)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'name',
    new.email,
    (new.raw_user_meta_data->>'dob')::date,
    new.raw_user_meta_data->>'acc_type'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create customer profile when a user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
