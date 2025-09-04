import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { stripe } from '@/lib/stripe'

// MongoDB connection
let client
let db

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

// Helper function to handle CORS
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

// Verify JWT token
function verifyToken(request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return null
  
  const token = authHeader.split(' ')[1]
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return null
  }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// Sample packages data
const samplePackages = [
  {
    id: uuidv4(),
    title: "Rajasthan Royal Heritage",
    description: "Experience the royal grandeur of Rajasthan with palace stays, desert safaris, and cultural shows.",
    price: 15999,
    duration: "7 Days / 6 Nights",
    image: "https://images.unsplash.com/photo-1554263762-17f646b8a3fe?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwyfHxJbmRpYSUyMHRyYXZlbCUyMGRlc3RpbmF0aW9uc3xlbnwwfHx8fDE3NTY5NjcyOTB8MA&ixlib=rb-4.1.0&q=85",
    highlights: ["Udaipur City Palace", "Jaisalmer Desert", "Jodhpur Fort"],
    rating: 4.8,
    category: "heritage",
    featured: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: uuidv4(),
    title: "Kerala Backwaters Bliss",
    description: "Sail through serene backwaters, stay in houseboats, and explore spice plantations in God's Own Country.",
    price: 12999,
    duration: "6 Days / 5 Nights",
    image: "https://images.unsplash.com/photo-1685850749074-9cf8023d7e8d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxJbmRpYSUyMHRyYXZlbCUyMGRlc3RpbmF0aW9uc3xlbnwwfHx8fDE3NTY5NjcyOTB8MA&ixlib=rb-4.1.0&q=85",
    highlights: ["Alleppey Houseboats", "Munnar Tea Gardens", "Kochi Heritage"],
    rating: 4.9,
    category: "nature",
    featured: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: uuidv4(),
    title: "Himalayan Adventure",
    description: "Trek through breathtaking mountain trails, visit ancient monasteries, and witness spectacular sunrises.",
    price: 18999,
    duration: "8 Days / 7 Nights",
    image: "https://images.unsplash.com/photo-1745737204244-db3bbf72e3fa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxJbmRpYSUyMG1vdW50YWluc3xlbnwwfHx8fDE3NTY5NjczMDF8MA&ixlib=rb-4.1.0&q=85",
    highlights: ["Manali Valley", "Rohtang Pass", "Dharamshala Monasteries"],
    rating: 4.7,
    category: "adventure",
    featured: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: uuidv4(),
    title: "Golden Triangle Classic",
    description: "Discover India's most iconic destinations - Delhi, Agra, and Jaipur in this classic circuit.",
    price: 13999,
    duration: "6 Days / 5 Nights",
    image: "https://images.unsplash.com/photo-1664081507458-94de02277afe?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwzfHxJbmRpYSUyMHRyYXZlbCUyMGRlc3RpbmF0aW9uc3xlbnwwfHx8fDE3NTY5NjcyOTB8MA&ixlib=rb-4.1.0&q=85",
    highlights: ["Taj Mahal", "Red Fort", "Amber Palace"],
    rating: 4.6,
    category: "heritage",
    featured: false,
    created_at: new Date(),
    updated_at: new Date()
  }
];

// Initialize admin user
async function initializeAdmin() {
  try {
    const db = await connectToMongo()
    
    const existingAdmin = await db.collection('users').findOne({ role: 'admin' })
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 12)
      await db.collection('users').insertOne({
        id: uuidv4(),
        email: 'admin@holidayexplorer.com',
        password: hashedPassword,
        role: 'admin',
        name: 'Admin User',
        created_at: new Date()
      })
      console.log('Admin user created: admin@holidayexplorer.com / admin123')
    }

    // Initialize sample packages
    const packagesCount = await db.collection('packages').countDocuments()
    if (packagesCount === 0) {
      await db.collection('packages').insertMany(samplePackages)
      console.log('Sample packages initialized')
    }
  } catch (error) {
    console.error('Error initializing admin:', error)
  }
}

// Initialize on startup
initializeAdmin()

// Route handler function
async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await connectToMongo()

    // Root endpoint
    if (route === '/' && method === 'GET') {
      return handleCORS(NextResponse.json({ 
        message: "Holiday Explorer API",
        version: "1.0.0",
        endpoints: {
          auth: "/api/auth/*",
          packages: "/api/packages",
          bookings: "/api/bookings",
          payments: "/api/payments/*",
          admin: "/api/admin/*"
        }
      }))
    }

    // AUTH ENDPOINTS
    if (route === '/auth/login' && method === 'POST') {
      const body = await request.json()
      const { email, password } = body

      if (!email || !password) {
        return handleCORS(NextResponse.json(
          { error: "Email and password are required" }, 
          { status: 400 }
        ))
      }

      const user = await db.collection('users').findOne({ email })
      if (!user) {
        return handleCORS(NextResponse.json(
          { error: "Invalid credentials" }, 
          { status: 401 }
        ))
      }

      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return handleCORS(NextResponse.json(
          { error: "Invalid credentials" }, 
          { status: 401 }
        ))
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      const { password: _, ...userWithoutPassword } = user
      return handleCORS(NextResponse.json({
        user: userWithoutPassword,
        token
      }))
    }

    // PACKAGES ENDPOINTS
    if (route === '/packages' && method === 'GET') {
      const packages = await db.collection('packages')
        .find({})
        .sort({ created_at: -1 })
        .toArray()

      const cleanedPackages = packages.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleanedPackages))
    }

    if (route.startsWith('/packages/') && method === 'GET') {
      const packageId = route.split('/')[2]
      const packageData = await db.collection('packages').findOne({ id: packageId })
      
      if (!packageData) {
        return handleCORS(NextResponse.json(
          { error: "Package not found" }, 
          { status: 404 }
        ))
      }

      const { _id, ...cleanedPackage } = packageData
      return handleCORS(NextResponse.json(cleanedPackage))
    }

    // ADMIN PACKAGES MANAGEMENT
    if (route === '/admin/packages' && method === 'POST') {
      const token = verifyToken(request)
      if (!token || token.role !== 'admin') {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" }, 
          { status: 401 }
        ))
      }

      const body = await request.json()
      const newPackage = {
        id: uuidv4(),
        ...body,
        created_at: new Date(),
        updated_at: new Date()
      }

      await db.collection('packages').insertOne(newPackage)
      const { _id, ...cleanedPackage } = newPackage
      return handleCORS(NextResponse.json(cleanedPackage))
    }

    if (route.startsWith('/admin/packages/') && method === 'PUT') {
      const token = verifyToken(request)
      if (!token || token.role !== 'admin') {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" }, 
          { status: 401 }
        ))
      }

      const packageId = route.split('/')[3]
      const body = await request.json()
      
      const updatedPackage = {
        ...body,
        updated_at: new Date()
      }

      await db.collection('packages').updateOne(
        { id: packageId },
        { $set: updatedPackage }
      )

      return handleCORS(NextResponse.json({ success: true }))
    }

    // PAYMENT ENDPOINTS
    if (route === '/payments/create-checkout' && method === 'POST') {
      const body = await request.json()
      const { packageId, customerInfo, customAmount } = body

      let amount, currency = 'inr', name = 'Custom Package'
      
      if (packageId) {
        const package = await db.collection('packages').findOne({ id: packageId })
        if (!package) {
          return handleCORS(NextResponse.json(
            { error: "Package not found" }, 
            { status: 404 }
          ))
        }
        amount = package.price * 100 // Convert to paise
        name = package.title
      } else if (customAmount) {
        amount = customAmount * 100 // Convert to paise
      } else {
        return handleCORS(NextResponse.json(
          { error: "Package ID or custom amount required" }, 
          { status: 400 }
        ))
      }

      const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/booking/cancel`,
        customer_email: customerInfo?.email,
        metadata: {
          packageId: packageId || 'custom',
          customerName: customerInfo?.name || '',
          customerPhone: customerInfo?.phone || '',
        },
      })

      // Store booking in database
      const bookingData = {
        id: uuidv4(),
        sessionId: session.id,
        packageId: packageId || null,
        amount: amount / 100,
        currency,
        customerInfo,
        status: 'pending',
        paymentStatus: 'unpaid',
        created_at: new Date(),
        updated_at: new Date()
      }

      await db.collection('bookings').insertOne(bookingData)

      return handleCORS(NextResponse.json({ 
        url: session.url, 
        sessionId: session.id 
      }))
    }

    if (route.startsWith('/payments/session/') && method === 'GET') {
      const sessionId = route.split('/')[3]
      
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      
      // Update booking in database
      await db.collection('bookings').updateOne(
        { sessionId },
        {
          $set: {
            status: session.status,
            paymentStatus: session.payment_status,
            updated_at: new Date(),
          },
        }
      )

      return handleCORS(NextResponse.json({
        status: session.status,
        payment_status: session.payment_status,
        amount_total: session.amount_total / 100,
        currency: session.currency,
        metadata: session.metadata,
      }))
    }

    // ADMIN DASHBOARD ENDPOINTS
    if (route === '/admin/dashboard' && method === 'GET') {
      const token = verifyToken(request)
      if (!token || token.role !== 'admin') {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" }, 
          { status: 401 }
        ))
      }

      const totalPackages = await db.collection('packages').countDocuments()
      const totalBookings = await db.collection('bookings').countDocuments()
      const paidBookings = await db.collection('bookings').countDocuments({ paymentStatus: 'paid' })
      
      const revenueResult = await db.collection('bookings').aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).toArray()
      
      const totalRevenue = revenueResult[0]?.total || 0

      return handleCORS(NextResponse.json({
        totalPackages,
        totalBookings,
        paidBookings,
        totalRevenue,
        conversionRate: totalBookings > 0 ? (paidBookings / totalBookings * 100).toFixed(1) : 0
      }))
    }

    if (route === '/admin/bookings' && method === 'GET') {
      const token = verifyToken(request)
      if (!token || token.role !== 'admin') {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" }, 
          { status: 401 }
        ))
      }

      const bookings = await db.collection('bookings')
        .find({})
        .sort({ created_at: -1 })
        .limit(100)
        .toArray()

      const cleanedBookings = bookings.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleanedBookings))
    }

    // BOOKINGS ENDPOINTS
    if (route === '/bookings' && method === 'GET') {
      const sessionId = new URL(request.url).searchParams.get('sessionId')
      
      if (!sessionId) {
        return handleCORS(NextResponse.json(
          { error: "Session ID required" }, 
          { status: 400 }
        ))
      }

      const booking = await db.collection('bookings').findOne({ sessionId })
      if (!booking) {
        return handleCORS(NextResponse.json(
          { error: "Booking not found" }, 
          { status: 404 }
        ))
      }

      const { _id, ...cleanedBooking } = booking
      return handleCORS(NextResponse.json(cleanedBooking))
    }

    // Route not found
    return handleCORS(NextResponse.json(
      { error: `Route ${route} not found` }, 
      { status: 404 }
    ))

  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    ))
  }
}

// Export all HTTP methods
export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute