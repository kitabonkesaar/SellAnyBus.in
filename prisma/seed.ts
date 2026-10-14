import { PrismaClient, Role, UserStatus, SellerType, BusCategory, FuelType, Transmission, AcType, VehicleStatus, DocumentType, DocumentStatus, InspectionStatus, ValuationStatus, PublicationStatus, ListingVisibility, EnquiryStatus, LeadStage, LeadQualification, ActivityType, PaymentStatus, TransferStatus, ContentType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ODISHA_DISTRICTS = [
  { district: 'Khordha', city: 'Bhubaneswar' },
  { district: 'Cuttack', city: 'Cuttack' },
  { district: 'Balasore', city: 'Balasore' },
  { district: 'Puri', city: 'Puri' },
  { district: 'Sundargarh', city: 'Rourkela' },
  { district: 'Sambalpur', city: 'Sambalpur' },
  { district: 'Ganjam', city: 'Berhampur' },
  { district: 'Jharsuguda', city: 'Jharsuguda' },
  { district: 'Mayurbhanj', city: 'Baripada' },
  { district: 'Angul', city: 'Angul' },
  { district: 'Bargarh', city: 'Bargarh' },
  { district: 'Bhadrak', city: 'Bhadrak' },
  { district: 'Bolangir', city: 'Bolangir' },
  { district: 'Boudh', city: 'Boudh' },
  { district: 'Deogarh', city: 'Deogarh' },
  { district: 'Dhenkanal', city: 'Dhenkanal' },
  { district: 'Gajapati', city: 'Paralakhemundi' },
  { district: 'Jagatsinghpur', city: 'Jagatsinghpur' },
  { district: 'Jajpur', city: 'Jajpur' },
  { district: 'Kalahandi', city: 'Bhawanipatna' },
  { district: 'Kandhamal', city: 'Phulbani' },
  { district: 'Kendrapara', city: 'Kendrapara' },
  { district: 'Keonjhar', city: 'Kendujhar' },
  { district: 'Koraput', city: 'Jeypore' },
  { district: 'Malkangiri', city: 'Malkangiri' },
  { district: 'Nabarangpur', city: 'Nabarangpur' },
  { district: 'Nayagarh', city: 'Nayagarh' },
  { district: 'Nuapada', city: 'Nuapada' },
  { district: 'Rayagada', city: 'Rayagada' },
  { district: 'Subarnapur', city: 'Sonepur' },
];

async function main() {
  console.log('--- Starting Seed Script for SellAnyBus.in ---');

  // Clean existing tables
  await prisma.auditLog.deleteMany();
  await prisma.leadActivity.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.favourite.deleteMany();
  await prisma.listingReport.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.valuation.deleteMany();
  await prisma.inspectionPhoto.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.vehicleDocument.deleteMany();
  await prisma.vehicleMedia.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.sellerProfile.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.savedSearchAlert.deleteMany();
  await prisma.contentItem.deleteMany();
  await prisma.location.deleteMany();
  await prisma.user.deleteMany();

  // 1. Seed Locations
  console.log('Seeding Odisha locations (30 districts)...');
  for (const loc of ODISHA_DISTRICTS) {
    await prisma.location.create({
      data: {
        state: 'Odisha',
        district: loc.district,
        city: loc.city,
        code: `OD-${loc.district.slice(0, 3).toUpperCase()}`,
        active: true,
      },
    });
  }

  // 2. Seed Users
  console.log('Seeding Users (Admin, Inspectors, Sales, Sellers, Buyers)...');
  const adminPasswordHash = await bcrypt.hash('Admin@SellAnyBus2026!', 10);
  const staffPasswordHash = await bcrypt.hash('Staff@SellAnyBus2026!', 10);

  const admin = await prisma.user.create({
    data: {
      phone: '9876543210',
      email: 'admin@sellanybus.in',
      name: 'SellAnyBus Master Admin',
      role: Role.ADMIN,
      passwordHash: adminPasswordHash,
      status: UserStatus.ACTIVE,
    },
  });

  const inspector1 = await prisma.user.create({
    data: {
      phone: '9876543211',
      email: 'inspector1@sellanybus.in',
      name: 'Ashok Kumar Panda (Lead Inspector)',
      role: Role.INSPECTOR,
      passwordHash: staffPasswordHash,
      status: UserStatus.ACTIVE,
    },
  });

  const inspector2 = await prisma.user.create({
    data: {
      phone: '9876543212',
      email: 'inspector2@sellanybus.in',
      name: 'Biswajit Jena (Technical Inspector)',
      role: Role.INSPECTOR,
      passwordHash: staffPasswordHash,
      status: UserStatus.ACTIVE,
    },
  });

  const sales1 = await prisma.user.create({
    data: {
      phone: '9876543213',
      email: 'sales1@sellanybus.in',
      name: 'Priyabrata Mishra (Fleet Relationship Manager)',
      role: Role.SALES_EXECUTIVE,
      passwordHash: staffPasswordHash,
      status: UserStatus.ACTIVE,
    },
  });

  const sales2 = await prisma.user.create({
    data: {
      phone: '9876543214',
      email: 'sales2@sellanybus.in',
      name: 'Deepika Patnaik (Commercial Advisor)',
      role: Role.SALES_EXECUTIVE,
      passwordHash: staffPasswordHash,
      status: UserStatus.ACTIVE,
    },
  });

  // Sellers
  const sellersData = [
    {
      phone: '9876543220',
      name: 'Pradeep Routray',
      type: SellerType.FLEET_OPERATOR,
      businessName: 'Kalinga Super Deluxe Express',
      district: 'Khordha',
    },
    {
      phone: '9876543221',
      name: 'Manoj Mohapatra',
      type: SellerType.DEALER,
      businessName: 'Utkal Commercial Bus Bazaar',
      district: 'Cuttack',
    },
    {
      phone: '9876543222',
      name: 'Debashis Tripathy',
      type: SellerType.TOURISM_COMPANY,
      businessName: 'Jagannath Pilgrim & Luxury Coach Services',
      district: 'Puri',
    },
    {
      phone: '9876543223',
      name: 'Dr. Sailendra Ray',
      type: SellerType.SCHOOL_INSTITUTION,
      businessName: 'Kalinga Vidyamandir Transport Trust',
      district: 'Khordha',
    },
    {
      phone: '9876543224',
      name: 'Ramesh Chandra Dash',
      type: SellerType.INDIVIDUAL_OWNER,
      businessName: 'Dash Passenger Transport',
      district: 'Sambalpur',
    },
  ];

  const createdSellers = [];
  for (const s of sellersData) {
    const user = await prisma.user.create({
      data: {
        phone: s.phone,
        name: s.name,
        role: Role.SELLER,
        status: UserStatus.ACTIVE,
        sellerProfile: {
          create: {
            sellerType: s.type,
            businessName: s.businessName,
            district: s.district,
            verificationStatus: 'VERIFIED',
          },
        },
      },
    });
    createdSellers.push(user);
  }

  // Buyers
  const buyersData = [
    { phone: '9876543230', name: 'Subrat Mohanty' },
    { phone: '9876543231', name: 'Deepak Sahoo' },
    { phone: '9876543232', name: 'Maa Tarini Travels' },
    { phone: '9876543233', name: 'Odisha Royal Lines' },
    { phone: '9876543234', name: 'Blue Diamond Coaches' },
  ];

  const createdBuyers = [];
  for (const b of buyersData) {
    const user = await prisma.user.create({
      data: {
        phone: b.phone,
        name: b.name,
        role: Role.BUYER,
        status: UserStatus.ACTIVE,
      },
    });
    createdBuyers.push(user);
  }

  // 3. Seed Realistic Commercial Bus Inventory (24 Vehicles, ≥12 PUBLISHED)
  console.log('Seeding 24 vehicles across all categories with realistic specs & pricing...');

  const BUS_TEMPLATES = [
    {
      category: BusCategory.AC_SLEEPER,
      bodyType: 'Multi-Axle Luxury Sleeper',
      make: 'Volvo',
      model: 'B11R 9600 Multi-Axle',
      mfgYear: 2022,
      regYear: 2022,
      fuel: FuelType.DIESEL,
      transmission: Transmission.AUTOMATIC,
      seats: 36,
      sleeperConfig: '36 Berths (2+1 Upper/Lower Sleeper)',
      ac: AcType.AC,
      km: 185000,
      price: 6200000,
      valMin: 5900000,
      valMax: 6400000,
      district: 'Khordha',
      city: 'Bhubaneswar',
      colour: 'Pearl White & Royal Blue',
      status: VehicleStatus.PUBLISHED,
      slug: '2022-volvo-b11r-9600-multi-axle-ac-sleeper-bhubaneswar',
      cond: 'Exceptional condition flagship coach. Operated on Bhubaneswar-Hyderabad premium express route. Full Volvo authorized service record with retarder warranty active.',
    },
    {
      category: BusCategory.AC_SLEEPER,
      bodyType: 'Intercity AC Sleeper Coach',
      make: 'Scania',
      model: 'Metrolink HD 13.7M',
      mfgYear: 2021,
      regYear: 2021,
      fuel: FuelType.DIESEL,
      transmission: Transmission.AUTOMATIC,
      seats: 32,
      sleeperConfig: '32 Berths (2+1 Air-conditioned Sleeper)',
      ac: AcType.AC,
      km: 240000,
      price: 5450000,
      valMin: 5200000,
      valMax: 5600000,
      district: 'Cuttack',
      city: 'Cuttack',
      colour: 'Metallic Crimson Red',
      status: VehicleStatus.PUBLISHED,
      slug: '2021-scania-metrolink-hd-ac-sleeper-cuttack',
      cond: 'Maintained with Opticruise transmission. Pristine interiors, individual USB charging and reading lamps at every berth. 6 new Michelin tyres fitted 15k km ago.',
    },
    {
      category: BusCategory.AC_SLEEPER,
      bodyType: 'Custom AC Sleeper Coach',
      make: 'Ashok Leyland',
      model: '13.5M 250HP Sleeper',
      mfgYear: 2020,
      regYear: 2020,
      fuel: FuelType.DIESEL,
      transmission: Transmission.MANUAL,
      seats: 34,
      sleeperConfig: '34 Sleeper Berths (Prakash Body)',
      ac: AcType.AC,
      km: 295000,
      price: 3650000,
      valMin: 3400000,
      valMax: 3800000,
      district: 'Puri',
      city: 'Puri',
      colour: 'Golden Yellow & Silver',
      status: VehicleStatus.PUBLISHED,
      slug: '2020-ashok-leyland-13-5m-250hp-ac-sleeper-puri',
      cond: 'Prakash built aerodynamic sleeper body. iGen6 BS6 engine in top mechanical shape. Valid All India Tourist Permit (AITP) until 2027.',
    },
    {
      category: BusCategory.SEATER,
      bodyType: 'Intercity High Deck Seater',
      make: 'Tata',
      model: 'LPO 1618 BS6 Ultra',
      mfgYear: 2021,
      regYear: 2022,
      fuel: FuelType.DIESEL,
      transmission: Transmission.MANUAL,
      seats: 49,
      sleeperConfig: null,
      ac: AcType.AC,
      km: 195000,
      price: 2850000,
      valMin: 2700000,
      valMax: 3000000,
      district: 'Ganjam',
      city: 'Berhampur',
      colour: 'Deep Navy Blue',
      status: VehicleStatus.PUBLISHED,
      slug: '2021-tata-lpo-1618-bs6-ultra-ac-seater-berhampur',
      cond: '49 push-back luxury seats with armrests and magazine pouches. Chilled Denso roof-mounted AC unit. Operated between Berhampur and Visakhapatnam.',
    },
    {
      category: BusCategory.SEATER,
      bodyType: 'Route Express Passenger Bus',
      make: 'Ashok Leyland',
      model: 'Viking 222 WB BS4',
      mfgYear: 2019,
      regYear: 2019,
      fuel: FuelType.DIESEL,
      transmission: Transmission.MANUAL,
      seats: 55,
      sleeperConfig: null,
      ac: AcType.NON_AC,
      km: 380000,
      price: 1650000,
      valMin: 1550000,
      valMax: 1750000,
      district: 'Balasore',
      city: 'Balasore',
      colour: 'Parrot Green & White',
      status: VehicleStatus.PUBLISHED,
      slug: '2019-ashok-leyland-viking-222-wb-route-bus-balasore',
      cond: 'Sturdy passenger route bus with Odisha State Stage Carriage permit. Heavy-duty suspension, new brake linings, freshly serviced inline FIP engine.',
    },
    {
      category: BusCategory.SEATER,
      bodyType: 'Executive Intercity Seater',
      make: 'Bharat Benz',
      model: '1623 230HP Glider Coach',
      mfgYear: 2021,
      regYear: 2021,
      fuel: FuelType.DIESEL,
      transmission: Transmission.MANUAL,
      seats: 45,
      sleeperConfig: null,
      ac: AcType.AC,
      km: 210000,
      price: 3450000,
      valMin: 3300000,
      valMax: 3600000,
      district: 'Sambalpur',
      city: 'Sambalpur',
      colour: 'Graphite Grey & Orange Accents',
      status: VehicleStatus.PUBLISHED,
      slug: '2021-bharat-benz-1623-glider-ac-seater-sambalpur',
      cond: 'Super smooth air suspension ride. Mercedes-derived OM906 engine providing outstanding fuel economy of 4.6 km/l. Comprehensive insurance valid.',
    },
    {
      category: BusCategory.SCHOOL_BUS,
      bodyType: 'School Bus Safe Transit',
      make: 'Eicher',
      model: 'Starline 20.15 M School Bus',
      mfgYear: 2020,
      regYear: 2020,
      fuel: FuelType.DIESEL,
      transmission: Transmission.MANUAL,
      seats: 44,
      sleeperConfig: null,
      ac: AcType.NON_AC,
      km: 98000,
      price: 1580000,
      valMin: 1450000,
      valMax: 1650000,
      district: 'Khordha',
      city: 'Bhubaneswar',
      colour: 'Regulation School Yellow',
      status: VehicleStatus.PUBLISHED,
      slug: '2020-eicher-starline-20-15-m-school-bus-bhubaneswar',
      cond: 'Fully compliant with Supreme Court school bus guidelines: emergency exit door, CCTV with DVR, vehicle GPS tracking, speed governor sealed at 40 km/h.',
    },
    {
      category: BusCategory.SCHOOL_BUS,
      bodyType: 'Standard School Bus',
      make: 'Tata',
      model: 'Starbus Skool 40 Seater',
      mfgYear: 2019,
      regYear: 2019,
      fuel: FuelType.DIESEL,
      transmission: Transmission.MANUAL,
      seats: 40,
      sleeperConfig: null,
      ac: AcType.NON_AC,
      km: 112000,
      price: 1320000,
      valMin: 1250000,
      valMax: 1400000,
      district: 'Cuttack',
      city: 'Cuttack',
      colour: 'Highway School Yellow',
      status: VehicleStatus.PUBLISHED,
      slug: '2019-tata-starbus-skool-40-seater-cuttack',
      cond: 'Directly from reputed private school in Cuttack. Low genuine odometer reading, non-hypothecated, single owner on RC, pristine child-safe seating.',
    },
    {
      category: BusCategory.STAFF_BUS,
      bodyType: 'Corporate Staff Shuttle Coach',
      make: 'Tata',
      model: 'Ultra 36 Seater AC Staff Bus',
      mfgYear: 2022,
      regYear: 2022,
      fuel: FuelType.DIESEL,
      transmission: Transmission.MANUAL,
      seats: 36,
      sleeperConfig: null,
      ac: AcType.AC,
      km: 135000,
      price: 2480000,
      valMin: 2350000,
      valMax: 2600000,
      district: 'Sundargarh',
      city: 'Rourkela',
      colour: 'Corporate Silver & Deep Blue',
      status: VehicleStatus.PUBLISHED,
      slug: '2022-tata-ultra-36-seater-ac-staff-bus-rourkela',
      cond: 'Used strictly for IT & Steel corporate executive staff shuttle. Excellent AC cooling, fabric pushback seats, spotless dashboard and zero mechanical issues.',
    },
    {
      category: BusCategory.STAFF_BUS,
      bodyType: 'Industrial Worker Staff Bus',
      make: 'Ashok Leyland',
      model: 'Falcon Heavy Duty Staff Bus',
      mfgYear: 2018,
      regYear: 2018,
      fuel: FuelType.DIESEL,
      transmission: Transmission.MANUAL,
      seats: 50,
      sleeperConfig: null,
      ac: AcType.NON_AC,
      km: 265000,
      price: 1150000,
      valMin: 1050000,
      valMax: 1250000,
      district: 'Jharsuguda',
      city: 'Jharsuguda',
      colour: 'Off-White with Red Striping',
      status: VehicleStatus.PUBLISHED,
      slug: '2018-ashok-leyland-falcon-staff-bus-jharsuguda',
      cond: 'Rugged and reliable industrial staff commuter. Engine overhauled 30,000 km ago. Heavy chassis, clean title, fitness certificate valid through 2026.',
    },
    {
      category: BusCategory.TOURIST_COACH,
      bodyType: 'Super Luxury Tourist Coach',
      make: 'Volvo',
      model: 'B8R 410HP Intercity Coach',
      mfgYear: 2021,
      regYear: 2021,
      fuel: FuelType.DIESEL,
      transmission: Transmission.AUTOMATIC,
      seats: 45,
      sleeperConfig: null,
      ac: AcType.AC,
      km: 215000,
      price: 4850000,
      valMin: 4600000,
      valMax: 5000000,
      district: 'Puri',
      city: 'Puri',
      colour: 'Gold Metallic & Maroon',
      status: VehicleStatus.PUBLISHED,
      slug: '2021-volvo-b8r-410hp-tourist-coach-puri',
      cond: 'Premier pilgrim and tourism coach. I-Shift automatic gearbox, electronic stability program, calf supports on all seats, twin LCD monitors.',
    },
    {
      category: BusCategory.MINI_BUS,
      bodyType: 'Executive Mini Bus',
      make: 'Force',
      model: 'Traveller Monobus 3350 20 Seater',
      mfgYear: 2022,
      regYear: 2022,
      fuel: FuelType.DIESEL,
      transmission: Transmission.MANUAL,
      seats: 20,
      sleeperConfig: null,
      ac: AcType.AC,
      km: 88000,
      price: 1920000,
      valMin: 1800000,
      valMax: 2000000,
      district: 'Khordha',
      city: 'Bhubaneswar',
      colour: 'Arctic White',
      status: VehicleStatus.PUBLISHED,
      slug: '2022-force-traveller-monobus-20-seater-ac-bhubaneswar',
      cond: 'Mercedes-derived FM2.6 CR ED engine. 1x1 wide seating layout, individual AC vents, top luggage carrier, immaculate single operator history.',
    },
    {
      category: BusCategory.MINI_BUS,
      bodyType: 'Mini Bus / Traveller',
      make: 'Eicher',
      model: 'Skyline Pro 3008 AC Mini',
      mfgYear: 2021,
      regYear: 2021,
      fuel: FuelType.DIESEL,
      transmission: Transmission.MANUAL,
      seats: 24,
      sleeperConfig: null,
      ac: AcType.AC,
      km: 122000,
      price: 1750000,
      valMin: 1650000,
      valMax: 1850000,
      district: 'Angul',
      city: 'Angul',
      colour: 'Silver Metallic',
      status: VehicleStatus.PUBLISHED,
      slug: '2021-eicher-skyline-pro-3008-ac-mini-angul',
      cond: 'Smooth BS6 CRDi engine, power steering, disc brakes at front, rear luggage booth, high back executive seats. Ideal for tours and staff transfer.',
    },
    {
      category: BusCategory.MINI_BUS,
      bodyType: 'School Mini Van',
      make: 'Swaraj Mazda',
      model: 'S7 School 28 Seater',
      mfgYear: 2017,
      regYear: 2017,
      fuel: FuelType.DIESEL,
      transmission: Transmission.MANUAL,
      seats: 28,
      sleeperConfig: null,
      ac: AcType.NON_AC,
      km: 175000,
      price: 680000,
      valMin: 620000,
      valMax: 720000,
      district: 'Mayurbhanj',
      city: 'Baripada',
      colour: 'Canary Yellow',
      status: VehicleStatus.PUBLISHED,
      slug: '2017-swaraj-mazda-s7-school-28-seater-baripada',
      cond: 'Affordable school mini bus with clean chassis, recent clutch overhaul, all documents up to date with Baripada RTO.',
    },
    // Non-published vehicles demonstrating workflow stages
    {
      category: BusCategory.AC_SLEEPER,
      bodyType: 'AC Sleeper Coach',
      make: 'Bharat Benz',
      model: '1623 12M Sleeper',
      mfgYear: 2023,
      regYear: 2023,
      fuel: FuelType.DIESEL,
      transmission: Transmission.MANUAL,
      seats: 30,
      sleeperConfig: '30 Berths (2+1)',
      ac: AcType.AC,
      km: 95000,
      price: 4900000,
      valMin: 4700000,
      valMax: 5100000,
      district: 'Khordha',
      city: 'Bhubaneswar',
      colour: 'Metallic Teal',
      status: VehicleStatus.AWAITING_SELLER_PRICE_APPROVAL,
      slug: '2023-bharat-benz-1623-ac-sleeper-bhubaneswar',
      cond: 'Near brand new condition. Inspection completed with 94/100 score. Valuation recommended ₹48,00,000. Waiting for seller to click approve price in dashboard.',
    },
    {
      category: BusCategory.SEATER,
      bodyType: 'Intercity Seater',
      make: 'Eicher',
      model: 'Pro 20.15 48 Seater',
      mfgYear: 2022,
      regYear: 2022,
      fuel: FuelType.DIESEL,
      transmission: Transmission.MANUAL,
      seats: 48,
      sleeperConfig: null,
      ac: AcType.AC,
      km: 140000,
      price: 2600000,
      valMin: 2450000,
      valMax: 2700000,
      district: 'Cuttack',
      city: 'Cuttack',
      colour: 'Cobalt Blue',
      status: VehicleStatus.INSPECTION_PENDING,
      slug: '2022-eicher-pro-20-15-seater-cuttack',
      cond: 'Documents verified by SellAnyBus team. Physical inspection appointment scheduled with Inspector Ashok Kumar Panda.',
    },
    {
      category: BusCategory.SEATER,
      bodyType: 'Passenger Bus',
      make: 'Tata',
      model: 'LPO 1512 Cowl Chassis',
      mfgYear: 2018,
      regYear: 2018,
      fuel: FuelType.DIESEL,
      transmission: Transmission.MANUAL,
      seats: 52,
      sleeperConfig: null,
      ac: AcType.NON_AC,
      km: 340000,
      price: 1250000,
      valMin: 1100000,
      valMax: 1300000,
      district: 'Puri',
      city: 'Puri',
      colour: 'Orange & Cream',
      status: VehicleStatus.UNDER_REVIEW,
      slug: '2018-tata-lpo-1512-passenger-bus-puri',
      cond: 'Seller submitted vehicle details. Document verification queue has pending RC and Fitness checks.',
    },
    {
      category: BusCategory.MINI_BUS,
      bodyType: 'Mini Coach',
      make: 'Mahindra',
      model: 'Cruzio Grande 25 Seater AC',
      mfgYear: 2021,
      regYear: 2021,
      fuel: FuelType.DIESEL,
      transmission: Transmission.MANUAL,
      seats: 25,
      sleeperConfig: null,
      ac: AcType.AC,
      km: 110000,
      price: 1850000,
      valMin: 1700000,
      valMax: 1900000,
      district: 'Ganjam',
      city: 'Berhampur',
      colour: 'Silver & Burgundy',
      status: VehicleStatus.SUBMITTED,
      slug: '2021-mahindra-cruzio-grande-25-seater-berhampur',
      cond: 'Fresh submission from seller. Initial verification pending.',
    },
    {
      category: BusCategory.TOURIST_COACH,
      bodyType: 'Luxury Tourist Coach',
      make: 'Ashok Leyland',
      model: 'Oyster 37 Seater AC',
      mfgYear: 2021,
      regYear: 2021,
      fuel: FuelType.DIESEL,
      transmission: Transmission.MANUAL,
      seats: 37,
      sleeperConfig: null,
      ac: AcType.AC,
      km: 165000,
      price: 2950000,
      valMin: 2800000,
      valMax: 3100000,
      district: 'Sambalpur',
      city: 'Sambalpur',
      colour: 'Golden Bronze',
      status: VehicleStatus.SOLD,
      slug: '2021-ashok-leyland-oyster-37-seater-sambalpur',
      cond: 'Successfully sold via SellAnyBus managed marketplace! Ownership transfer completed through Sambalpur RTO.',
    },
    {
      category: BusCategory.SEATER,
      bodyType: 'Rural Express',
      make: 'Tata',
      model: '1109 Cowl',
      mfgYear: 2015,
      regYear: 2015,
      fuel: FuelType.DIESEL,
      transmission: Transmission.MANUAL,
      seats: 38,
      sleeperConfig: null,
      ac: AcType.NON_AC,
      km: 490000,
      price: 520000,
      valMin: 450000,
      valMax: 550000,
      district: 'Bolangir',
      city: 'Bolangir',
      colour: 'Green & White',
      status: VehicleStatus.REJECTED,
      slug: '2015-tata-1109-rural-express-bolangir',
      cond: 'Rejected due to structural chassis corrosion and mismatched engine serial numbers during document inspection.',
    },
    {
      category: BusCategory.STAFF_BUS,
      bodyType: 'Staff Shuttle',
      make: 'Force',
      model: 'Traveller 4020 Super 26 Seater',
      mfgYear: 2023,
      regYear: 2023,
      fuel: FuelType.DIESEL,
      transmission: Transmission.MANUAL,
      seats: 26,
      sleeperConfig: null,
      ac: AcType.AC,
      km: 55000,
      price: 2350000,
      valMin: 2200000,
      valMax: 2450000,
      district: 'Jharsuguda',
      city: 'Jharsuguda',
      colour: 'Pure White',
      status: VehicleStatus.DRAFT,
      slug: '2023-force-traveller-4020-staff-jharsuguda',
      cond: 'Draft vehicle created by Utkal Commercial Bus Bazaar; waiting for additional photos.',
    },
    {
      category: BusCategory.AC_SLEEPER,
      bodyType: 'Multi-Axle Sleeper',
      make: 'Volvo',
      model: '9400 B9R Multi-Axle Sleeper',
      mfgYear: 2019,
      regYear: 2019,
      fuel: FuelType.DIESEL,
      transmission: Transmission.AUTOMATIC,
      seats: 36,
      sleeperConfig: '36 Berths (2+1)',
      ac: AcType.AC,
      km: 360000,
      price: 4300000,
      valMin: 4100000,
      valMax: 4500000,
      district: 'Khordha',
      city: 'Bhubaneswar',
      colour: 'Silver & Ocean Blue',
      status: VehicleStatus.PUBLISHED,
      slug: '2019-volvo-9400-b9r-sleeper-bhubaneswar',
      cond: 'High-performing Volvo multi-axle sleeper coach. Regularly operated on the Cuttack-Bengaluru interstate route. Genuine Volvo retarder and suspension parts used throughout.',
    },
    {
      category: BusCategory.SCHOOL_BUS,
      bodyType: 'College & University Bus',
      make: 'Ashok Leyland',
      model: 'Sunshine 50 Seater School Bus',
      mfgYear: 2021,
      regYear: 2021,
      fuel: FuelType.DIESEL,
      transmission: Transmission.MANUAL,
      seats: 50,
      sleeperConfig: null,
      ac: AcType.NON_AC,
      km: 78000,
      price: 2150000,
      valMin: 2000000,
      valMax: 2250000,
      district: 'Bhadrak',
      city: 'Bhadrak',
      colour: 'Sunshine School Yellow',
      status: VehicleStatus.PUBLISHED,
      slug: '2021-ashok-leyland-sunshine-50-seater-bhadrak',
      cond: 'Low floor height entry, broad gangway, anti-skid vinyl flooring, fire retardant upholstery, emergency window hammers installed at all standard bays.',
    },
    {
      category: BusCategory.TOURIST_COACH,
      bodyType: 'Executive Pilgrim Coach',
      make: 'Force',
      model: 'Urbania 17 Seater Luxury Van',
      mfgYear: 2023,
      regYear: 2023,
      fuel: FuelType.DIESEL,
      transmission: Transmission.MANUAL,
      seats: 17,
      sleeperConfig: null,
      ac: AcType.AC,
      km: 42000,
      price: 3100000,
      valMin: 2950000,
      valMax: 3200000,
      district: 'Puri',
      city: 'Puri',
      colour: 'Imperial Pearl Black',
      status: VehicleStatus.PUBLISHED,
      slug: '2023-force-urbania-17-seater-luxury-puri',
      cond: 'Flagship luxury traveller. Individual reclining calf-support captain seats, panoramic sealed side glasses, Apple CarPlay and Android Auto driver console, dual chiller AC.',
    },
  ];

  let publishedCount = 0;
  const createdVehicles = [];

  for (let i = 0; i < BUS_TEMPLATES.length; i++) {
    const t = BUS_TEMPLATES[i];
    const seller = createdSellers[i % createdSellers.length];
    const regNo = `OD${String((i % 30) + 1).padStart(2, '0')}AB${1000 + i * 47}`;

    const vehicle = await prisma.vehicle.create({
      data: {
        sellerId: seller.id,
        category: t.category,
        bodyType: t.bodyType,
        make: t.make,
        model: t.model,
        manufactureYear: t.mfgYear,
        registrationYear: t.regYear,
        registrationNumber: regNo,
        chassisNumberEnc: Buffer.from(`CHASSIS-${regNo}-XYZ`).toString('base64'),
        fuelType: t.fuel,
        transmission: t.transmission,
        odometerKm: t.km,
        seatingCapacity: t.seats,
        sleeperConfig: t.sleeperConfig,
        acType: t.ac,
        colour: t.colour,
        ownersCount: 1,
        permitType: t.category === BusCategory.AC_SLEEPER ? 'All India Tourist Permit (AITP)' : 'Odisha State Carriage Permit',
        hypothecated: i % 3 === 0,
        insuranceValidTill: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        state: 'Odisha',
        district: t.district,
        city: t.city,
        conditionSummary: t.cond,
        disclosedDefects: i % 5 === 0 ? 'Minor cosmetic scratch on left passenger lower skirt panel; mechanically perfect.' : null,
        serviceHistory: 'Full periodic maintenance logged with authorized dealer network.',
        status: t.status,
      },
    });

    createdVehicles.push(vehicle);

    // Seed Media (Photos)
    const photoCategories = ['front', 'rear', 'side-left', 'side-right', 'interior', 'dashboard', 'engine', 'tyres'];
    for (let pIdx = 0; pIdx < photoCategories.length; pIdx++) {
      await prisma.vehicleMedia.create({
        data: {
          vehicleId: vehicle.id,
          type: 'IMAGE',
          storageKey: `demo-bus-${(i % 6) + 1}-${photoCategories[pIdx]}.jpg`,
          position: pIdx,
          isPrimary: pIdx === 0,
          visibility: 'PUBLIC',
          width: 1280,
          height: 720,
        },
      });
    }

    // Seed Documents
    const docTypes = [DocumentType.RC, DocumentType.INSURANCE, DocumentType.FITNESS, DocumentType.PERMIT, DocumentType.TAX];
    for (const dt of docTypes) {
      const isDocVerified = t.status === VehicleStatus.PUBLISHED || t.status === VehicleStatus.SOLD || t.status === VehicleStatus.AWAITING_SELLER_PRICE_APPROVAL;
      await prisma.vehicleDocument.create({
        data: {
          vehicleId: vehicle.id,
          sellerId: seller.id,
          docType: dt,
          privateStorageKey: `private-doc-${vehicle.id}-${dt}.pdf`,
          status: isDocVerified ? DocumentStatus.VERIFIED : DocumentStatus.PENDING,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          verifiedBy: isDocVerified ? admin.id : null,
          verifiedAt: isDocVerified ? new Date() : null,
        },
      });
    }

    // Seed Inspection
    const isInspected = t.status === VehicleStatus.PUBLISHED || t.status === VehicleStatus.SOLD || t.status === VehicleStatus.AWAITING_SELLER_PRICE_APPROVAL;
    const checklistResults = {
      engine: { status: 'PASSED', note: 'Engine starts smoothly, zero exhaust blow-by, turbo spool normal.' },
      transmission: { status: 'PASSED', note: 'Clutch bite positive, gear selection crisp with no grinding.' },
      clutch: { status: 'PASSED', note: 'Normal pedal travel and free play.' },
      brakes: { status: 'PASSED', note: 'Full air brake pressure build in 3 mins. Lining thickness > 75%.' },
      suspension: { status: 'PASSED', note: 'Air bellows / leaf springs intact without cracks.' },
      steering: { status: 'PASSED', note: 'Power steering pump normal, zero play at center.' },
      tyres: { status: 'PASSED', note: 'Radial tread depth between 7mm to 9mm across all axles.' },
      electrical: { status: 'PASSED', note: 'Alternator charging at 28.2V, battery load test passed.' },
      acSystem: { status: t.ac === AcType.AC ? 'PASSED' : 'NOT_APPLICABLE', note: t.ac === AcType.AC ? 'Cabin cooled from 34°C to 21°C within 12 minutes.' : 'Non-AC' },
      bodyChassis: { status: 'PASSED', note: 'No chassis twist, zero structural rust.' },
      interiorSeats: { status: 'PASSED', note: 'Reclining mechanisms functional, clean upholstery.' },
      emergencyExits: { status: 'PASSED', note: 'Roof hatches and rear emergency door latch verified.' },
      lights: { status: 'PASSED', note: 'All marker lamps, fog lamps, and hazard signals working.' },
      documentsMatch: { status: 'PASSED', note: 'Chassis stamp and engine plate physically cross-verified with RC.' },
    };

    const inspection = await prisma.inspection.create({
      data: {
        vehicleId: vehicle.id,
        inspectorId: (i % 2 === 0 ? inspector1 : inspector2).id,
        scheduledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        location: `${t.city} Commercial RTO Inspection Yard`,
        status: isInspected ? InspectionStatus.APPROVED : InspectionStatus.SCHEDULED,
        checklistResults,
        overallScore: isInspected ? 88.5 + (i % 8) : null,
        summary: isInspected ? 'Vehicle mechanically sound, verified by certified commercial inspector. Recommended for immediate listing.' : 'Inspection in progress.',
        submittedAt: isInspected ? new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) : null,
        approvedAt: isInspected ? new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) : null,
        approvedBy: isInspected ? admin.id : null,
      },
    });

    // Seed Valuation
    await prisma.valuation.create({
      data: {
        vehicleId: vehicle.id,
        rangeMin: t.valMin,
        rangeMax: t.valMax,
        recommendedPrice: t.price,
        reviewedBy: admin.id,
        approvalStatus: isInspected ? ValuationStatus.APPROVED : ValuationStatus.DRAFT,
        comparables: [
          { make: t.make, model: t.model, year: t.mfgYear - 1, soldPrice: t.price - 200000 },
          { make: t.make, model: t.model, year: t.mfgYear, soldPrice: t.price + 100000 },
        ],
        factors: {
          odometerScore: 'Optimal for year',
          marketDemand: 'High in coastal and intercity routes',
          refurbishmentEstimate: 25000,
        },
      },
    });

    // Seed Listing if PUBLISHED or SOLD
    if (t.status === VehicleStatus.PUBLISHED || t.status === VehicleStatus.SOLD) {
      publishedCount++;
      const isFeatured = i < 5; // Top 5 featured
      const listing = await prisma.listing.create({
        data: {
          vehicleId: vehicle.id,
          slug: t.slug,
          askingPrice: t.price,
          publicationStatus: t.status === VehicleStatus.SOLD ? PublicationStatus.SOLD : PublicationStatus.PUBLISHED,
          visibility: ListingVisibility.PUBLIC,
          sellerApprovedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          sellerApprovedPrice: t.price,
          publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          featured: isFeatured,
          featuredUntil: isFeatured ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
          viewsCount: 140 + i * 29,
        },
      });

      // Sample enquiries on published vehicles
      if (i < 8) {
        const buyer = createdBuyers[i % createdBuyers.length];
        const enquiry = await prisma.enquiry.create({
          data: {
            listingId: listing.id,
            buyerUserId: buyer.id,
            name: buyer.name,
            phone: buyer.phone,
            intendedUse: i % 2 === 0 ? 'Passenger route operation' : 'Tourism / Pilgrim contract',
            timeline: i % 3 === 0 ? 'Immediately' : 'within 1 month',
            message: `Interested in inspecting this ${t.make} ${t.model}. Can you connect me with the sales advisor?`,
            status: EnquiryStatus.QUALIFIED,
          },
        });

        // Associated Lead in CRM
        const lead = await prisma.lead.create({
          data: {
            enquiryId: enquiry.id,
            assigneeId: (i % 2 === 0 ? sales1 : sales2).id,
            stage: i === 0 ? LeadStage.NEGOTIATION : LeadStage.QUALIFIED,
            qualification: LeadQualification.HIGH_PRIORITY,
            followUpAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          },
        });

        await prisma.leadActivity.create({
          data: {
            leadId: lead.id,
            type: ActivityType.CALL,
            content: 'Spoke with buyer. Confirmed purchase budget and route requirement. Scheduled virtual inspection review.',
            createdBy: sales1.id,
          },
        });

        // 1 Completed Transaction on the SOLD vehicle (Vehicle index 18)
        if (t.status === VehicleStatus.SOLD) {
          await prisma.transaction.create({
            data: {
              listingId: listing.id,
              leadId: lead.id,
              agreedPrice: 2850000,
              feeType: 'COMMISSION_PERCENT',
              feeAmount: 57000, // 2%
              paymentStatus: PaymentStatus.CONFIRMED,
              confirmedBy: admin.id,
              confirmedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              evidenceKeys: ['transaction_voucher_SBI_ref_20261012.pdf'],
              docChecklist: {
                form29_30: true,
                nocIssued: true,
                insuranceTransferred: true,
                rtoUpdated: true,
              },
              transferStatus: TransferStatus.COMPLETED,
            },
          });
        }
      }
    }
  }

  // 4. Seed Content Items (Testimonials, FAQs, Banners)
  console.log('Seeding Testimonials and FAQs...');

  const testimonials = [
    {
      title: 'Sold our 3 Volvo Sleepers in 18 days at great valuation',
      body: 'As a fleet operator in Bhubaneswar, finding verified buyers without endless tire-kickers used to be painful. SellAnyBus inspected the buses, set realistic asking prices, and qualified real buyers for us.',
      author: 'Ranjit Pattanaik, Managing Partner, Kalinga Deluxe Lines',
      order: 1,
    },
    {
      title: 'Transferred our school fleet seamlessly with complete RTO verification',
      body: 'We replaced four of our student transport buses. SellAnyBus verified all fitness and permit records upfront, giving buyers confidence and saving our administrative team weeks of hassle.',
      author: 'Sunita Mohanty, Transport Director, DAV Trust Schools Cuttack',
      order: 2,
    },
    {
      title: 'Bought an Ashok Leyland 49-Seater in top inspected condition',
      body: 'The 14-point mechanical report gave us full clarity on engine compression and brake condition before travelling to Berhampur. The deal completed safely with mediated documentation.',
      author: 'Santosh Kumar Sahu, Maa Tarini Roadlines Puri',
      order: 3,
    },
  ];

  for (const t of testimonials) {
    await prisma.contentItem.create({
      data: {
        type: ContentType.TESTIMONIAL,
        title: t.title,
        body: t.body,
        order: t.order,
        active: true,
        meta: { author: t.author },
      },
    });
  }

  const faqs = [
    {
      title: 'How does SellAnyBus verify commercial buses before publishing?',
      body: 'Every bus submitted undergoes a rigorous two-tier verification: first, our compliance desk validates the Registration Certificate (RC), commercial permit, fitness validity, road tax tokens, and insurance. Second, an authorized inspector performs a 14-point mechanical evaluation covering engine, transmission, air brakes, suspension, and chassis integrity.',
      order: 1,
    },
    {
      title: 'Why do sellers need to approve the recommended asking price?',
      body: 'To ensure transparent and fair transactions, our valuation team analyses recent comparable bus sales in Odisha and condition scores. Only when the seller explicitly approves the recommended price is the vehicle published to qualified buyers.',
      order: 2,
    },
    {
      title: 'Are private documents or seller contact numbers publicly visible?',
      body: 'No. Aadhaar numbers, RC copies, and personal phone numbers are never shown on public pages or APIs. All buyer enquiries are mediated through our dedicated commercial sales advisors to protect privacy.',
      order: 3,
    },
    {
      title: 'Which districts in Odisha are covered?',
      body: 'SellAnyBus operates across all 30 districts of Odisha with local physical inspection hubs in Bhubaneswar, Cuttack, Puri, Berhampur, Balasore, Sambalpur, and Rourkela.',
      order: 4,
    },
    {
      title: 'What assistance is provided for RTO ownership transfer?',
      body: 'We guide both buyer and seller through the complete documentation checklist, including Form 29 & Form 30 filings, RTO NOC issuance for interstate sales, and commercial permit and insurance transfers.',
      order: 5,
    },
  ];

  for (const f of faqs) {
    await prisma.contentItem.create({
      data: {
        type: ContentType.FAQ,
        title: f.title,
        body: f.body,
        order: f.order,
        active: true,
      },
    });
  }

  console.log('--- Seed Completed Successfully! ---');
  console.log(`Summary:
  - 30 Odisha Districts Seeded
  - 1 Admin (${admin.email} / Admin@SellAnyBus2026!)
  - 2 Inspectors, 2 Sales Executives
  - 5 Sellers, 5 Buyers
  - 24 Vehicles (${publishedCount} PUBLISHED, 1 SOLD with complete transaction)
  - Detailed 14-Point Inspections & Valuations
  - Sample Leads, Activities, Testimonials & FAQs
  `);
}

main()
  .catch((e) => {
    console.error('Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
