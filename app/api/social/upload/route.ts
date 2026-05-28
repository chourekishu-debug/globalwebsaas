// ============================================================
// POST /api/social/upload
// Uploads image and returns a public URL for use in posts
// ============================================================
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    // Validate file type
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, GIF, WebP images are allowed' }, { status: 400 })
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be under 10MB' }, { status: 400 })
    }

    // In production: upload to Supabase Storage or Cloudinary
    // For demo: return a placeholder URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (supabaseUrl && !supabaseUrl.includes('YOUR_PROJECT')) {
      // Upload to Supabase Storage
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `posts/${Date.now()}-${file.name.replace(/\s/g, '_')}`

      const uploadRes = await fetch(
        `${supabaseUrl}/storage/v1/object/social-images/${fileName}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': file.type,
            'x-upsert': 'true',
          },
          body: buffer,
        }
      )

      if (uploadRes.ok) {
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/social-images/${fileName}`
        return NextResponse.json({ success: true, url: publicUrl, fileName })
      }
    }

    // Demo fallback — return a placeholder
    return NextResponse.json({
      success: true,
      url: `https://via.placeholder.com/1080x1080/6C47FF/FFFFFF?text=${encodeURIComponent(file.name)}`,
      demo: true,
      message: 'Demo mode — configure Supabase Storage for real image uploads',
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
