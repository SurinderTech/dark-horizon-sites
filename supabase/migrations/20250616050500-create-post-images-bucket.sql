
-- Create storage bucket for post images
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true);

-- Create policy to allow authenticated users to upload images
CREATE POLICY "Users can upload post images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'post-images' AND auth.role() = 'authenticated');

-- Create policy to allow public access to view images
CREATE POLICY "Public can view post images" ON storage.objects
FOR SELECT USING (bucket_id = 'post-images');
