import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    phone: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    role: v.string(), // VISITOR, BUYER, SELLER, INSPECTOR, SALES_EXECUTIVE, ADMIN
    status: v.string(), // ACTIVE, SUSPENDED, DELETED
    passwordHash: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_phone', ['phone'])
    .index('by_email', ['email'])
    .index('by_role', ['role']),

  sellerProfiles: defineTable({
    userId: v.string(),
    sellerType: v.string(), // INDIVIDUAL_OWNER, FLEET_OPERATOR, DEALER, TOURISM_COMPANY, SCHOOL_INSTITUTION
    businessName: v.optional(v.string()),
    district: v.optional(v.string()),
    verificationStatus: v.string(), // PENDING, VERIFIED, REJECTED
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_userId', ['userId']),

  vehicles: defineTable({
    sellerId: v.string(),
    category: v.string(), // AC_SLEEPER, SEATER, SCHOOL_BUS, STAFF_BUS, TOURIST_COACH, MINI_BUS, TRUCK, PICKUP_VAN, TIPPER
    bodyType: v.string(),
    make: v.string(),
    model: v.string(),
    manufactureYear: v.number(),
    registrationYear: v.number(),
    registrationNumber: v.string(),
    chassisNumberEncrypted: v.string(),
    fuelType: v.string(), // DIESEL, CNG, ELECTRIC, HYBRID, OTHER
    transmission: v.string(), // MANUAL, AUTOMATIC
    odometerKm: v.number(),
    seatingCapacity: v.number(),
    sleeperConfig: v.optional(v.string()),
    acType: v.string(), // AC, NON_AC
    colour: v.string(),
    ownersCount: v.number(),
    permitType: v.optional(v.string()),
    hypothecated: v.boolean(),
    insuranceValidTill: v.optional(v.string()),
    state: v.string(),
    district: v.string(),
    city: v.string(),
    conditionSummary: v.string(),
    disclosedDefects: v.optional(v.string()),
    serviceHistory: v.optional(v.string()),
    status: v.string(), // DRAFT, SUBMITTED, UNDER_REVIEW, ...
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_sellerId', ['sellerId'])
    .index('by_status', ['status'])
    .index('by_category', ['category'])
    .index('by_district', ['district'])
    .index('by_registrationNumber', ['registrationNumber']),

  vehicleMedia: defineTable({
    vehicleId: v.string(),
    type: v.string(), // IMAGE, VIDEO
    storageKey: v.string(),
    position: v.number(),
    isPrimary: v.boolean(),
    visibility: v.string(), // PUBLIC, PRIVATE
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('by_vehicleId', ['vehicleId'])
    .index('by_vehicleId_isPrimary', ['vehicleId', 'isPrimary']),

  vehicleDocuments: defineTable({
    vehicleId: v.string(),
    type: v.string(), // RC, PERMIT, FITNESS, TAX_TOKEN, INSURANCE, PUCC, ...
    storageKey: v.string(),
    status: v.string(), // PENDING, VERIFIED, REJECTED, EXPIRED
    rejectionReason: v.optional(v.string()),
    verifiedAt: v.optional(v.number()),
    verifiedBy: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_vehicleId', ['vehicleId']),

  inspections: defineTable({
    vehicleId: v.string(),
    inspectorId: v.string(),
    overallScore: v.number(),
    engineScore: v.number(),
    transmissionScore: v.number(),
    suspensionScore: v.number(),
    brakeScore: v.number(),
    electricalScore: v.number(),
    tyresScore: v.number(),
    chassisScore: v.number(),
    acScore: v.number(),
    bodyScore: v.number(),
    interiorScore: v.number(),
    safetyScore: v.number(),
    reportJson: v.any(),
    status: v.string(), // SCHEDULED, IN_PROGRESS, COMPLETED, APPROVED, REJECTED, CANCELLED
    notes: v.optional(v.string()),
    inspectedAt: v.optional(v.number()),
    approvedAt: v.optional(v.number()),
    approvedBy: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_vehicleId', ['vehicleId'])
    .index('by_inspectorId', ['inspectorId'])
    .index('by_status', ['status']),

  inspectionPhotos: defineTable({
    inspectionId: v.string(),
    component: v.string(),
    storageKey: v.string(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }).index('by_inspectionId', ['inspectionId']),

  valuations: defineTable({
    vehicleId: v.string(),
    rangeMin: v.number(),
    rangeMax: v.number(),
    recommendedPrice: v.number(),
    comparables: v.optional(v.any()),
    factors: v.optional(v.any()),
    approvalStatus: v.string(), // DRAFT, SUBMITTED, APPROVED, REJECTED
    reviewedBy: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_vehicleId', ['vehicleId']),

  listings: defineTable({
    vehicleId: v.string(),
    slug: v.string(),
    askingPrice: v.number(),
    sellerApprovedPrice: v.boolean(),
    sellerApprovedAt: v.optional(v.number()),
    publicationStatus: v.string(), // UNPUBLISHED, PUBLISHED, ARCHIVED
    visibility: v.string(), // PUBLIC, PRIVATE, UNLISTED
    featured: v.boolean(),
    publishedAt: v.optional(v.number()),
    viewsCount: v.number(),
    enquiryCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_vehicleId', ['vehicleId'])
    .index('by_slug', ['slug'])
    .index('by_publicationStatus', ['publicationStatus'])
    .index('by_publicationStatus_featured', ['publicationStatus', 'featured']),

  listingReports: defineTable({
    listingId: v.string(),
    reporterPhone: v.optional(v.string()),
    reason: v.string(),
    details: v.optional(v.string()),
    status: v.string(),
    createdAt: v.number(),
  }).index('by_listingId', ['listingId']),

  enquiries: defineTable({
    vehicleId: v.string(),
    buyerId: v.optional(v.string()),
    buyerName: v.string(),
    buyerPhone: v.string(),
    message: v.optional(v.string()),
    status: v.string(), // NEW, CONTACTED, QUALIFIED, ...
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_vehicleId', ['vehicleId'])
    .index('by_buyerId', ['buyerId']),

  leads: defineTable({
    buyerId: v.optional(v.string()),
    vehicleId: v.optional(v.string()),
    buyerName: v.string(),
    buyerPhone: v.string(),
    assignedToId: v.optional(v.string()),
    stage: v.string(), // NEW, ATTEMPTED_CONTACT, ...
    qualification: v.string(), // UNQUALIFIED, HOT, WARM, COLD
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_buyerId', ['buyerId'])
    .index('by_assignedToId', ['assignedToId'])
    .index('by_stage', ['stage']),

  leadActivities: defineTable({
    leadId: v.string(),
    actorId: v.string(),
    type: v.string(), // CALL, NOTE, STATUS_CHANGE, ...
    description: v.string(),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  }).index('by_leadId', ['leadId']),

  transactions: defineTable({
    listingId: v.string(),
    buyerId: v.string(),
    sellerId: v.string(),
    agreedPrice: v.number(),
    tokenAmount: v.number(),
    tokenPaymentStatus: v.string(), // PENDING, SUCCESS, FAILED
    paymentMethod: v.string(),
    rtoTransferStatus: v.string(), // NOT_STARTED, IN_PROGRESS, COMPLETED
    nocIssued: v.boolean(),
    form29Issued: v.boolean(),
    form30Issued: v.boolean(),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_listingId', ['listingId'])
    .index('by_buyerId', ['buyerId'])
    .index('by_sellerId', ['sellerId']),

  auditLogs: defineTable({
    actorId: v.optional(v.string()),
    action: v.string(),
    entityType: v.string(),
    entityId: v.string(),
    before: v.optional(v.any()),
    after: v.optional(v.any()),
    reason: v.optional(v.string()),
    ip: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_actorId', ['actorId'])
    .index('by_entity', ['entityType', 'entityId']),

  savedSearchAlerts: defineTable({
    userId: v.optional(v.string()),
    phone: v.optional(v.string()),
    filters: v.any(),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_phone', ['phone']),

  notifications: defineTable({
    userId: v.string(),
    title: v.string(),
    message: v.string(),
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_isRead', ['userId', 'isRead']),

  contentItems: defineTable({
    type: v.string(), // FAQ, TESTIMONIAL, ...
    title: v.string(),
    body: v.string(),
    order: v.number(),
    active: v.boolean(),
    meta: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_type_active', ['type', 'active']),

  districtLocations: defineTable({
    district: v.string(),
    city: v.string(),
  }).index('by_district', ['district']),
});
