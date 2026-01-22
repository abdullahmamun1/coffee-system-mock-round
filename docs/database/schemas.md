# Coffee- System-Mock-Round - Database Schema Documentation

## Overview
This database supports a membership-based bonus point system for a coffee shop. Customers earn points with purchases and can redeem them for discounts.

**Business Rules:**
- **Point Earning:** For every 50 taka spent → 1 bonus point
- **Point Redemption:** 1 point = 1 taka discount

---

## Entity Relationship Diagram

```
┌─────────────────┐
│    members      │
│─────────────────│
│ member_id (PK)  │
│ name            │
│ phone           │
│ points          │
└────────┬────────┘
         │
         │ 1
         │
         │
         │ N
         │
┌────────▼────────┐         ┌─────────────────┐
│   purchases     │    N    │    coffees      │
│─────────────────│◄────────┤─────────────────│
│ id (PK)         │    1    │ id (PK)         │
│ member_id (FK)  │─────────┤ name            │
│ coffee_id (FK)  │         │ price           │
│ quantity        │         └─────────────────┘
│ total_amount    │
│ points_earned   │
│ created_at      │
└─────────────────┘
```

**Relationships:**
- One **member** can make many **purchases** (1:N)
- One **coffee** can appear in many **purchases** (1:N)
- Each **purchase** belongs to one member and references one coffee

---

## Table Definitions

### 1. `members`
Stores customer membership information and tracks bonus point balance.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| `member_id` | VARCHAR(50) | PRIMARY KEY | Unique member identifier (provided by client via API) |
| `name` | VARCHAR(100) | NOT NULL | Customer's full name |
| `phone` | VARCHAR(20) | NOT NULL | Contact phone number |
| `points` | INT | DEFAULT 0, CHECK >= 0 | Current bonus point balance |

**Primary Key:** `member_id`  
**Indexes:** `phone` (for quick lookup)

**Example Row:**
```
member_id: "M001"
name: "Rafiq Ahmed"
phone: "01712345678"
points: 15
```

---

### 2. `coffees`
Stores the coffee shop menu with current item prices.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, AUTO | Auto-generated unique identifier |
| `name` | VARCHAR(100) | NOT NULL | Coffee item name |
| `price` | NUMERIC(10,2) | NOT NULL, CHECK > 0 | Current price in taka |

**Primary Key:** `id` (UUID auto-generated)  
**No foreign keys**

**Example Row:**
```
id: "550e8400-e29b-41d4-a716-446655440000"
name: "Cappuccino"
price: 150.00
```

---

### 3. `purchases`
Records every purchase transaction with point calculations.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, AUTO | Auto-generated transaction ID |
| `member_id` | VARCHAR(50) | FOREIGN KEY, NOT NULL | Reference to members table |
| `coffee_id` | UUID | FOREIGN KEY, NOT NULL | Reference to coffees table |
| `quantity` | INT | NOT NULL, CHECK > 0 | Number of items purchased |
| `total_amount` | NUMERIC(10,2) | NOT NULL, CHECK >= 0 | Total purchase amount (price × quantity) |
| `points_earned` | INT | DEFAULT 0 | Points earned from this purchase (total_amount ÷ 50) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Transaction timestamp |

**Primary Key:** `id` (UUID auto-generated)  
**Foreign Keys:**
- `member_id` → `members(member_id)` (ON DELETE CASCADE)
- `coffee_id` → `coffees(id)` (ON DELETE RESTRICT)

**Indexes:** 
- `member_id` (for fast member purchase history)
- `created_at` (for time-based queries)

**Example Row:**
```
id: "123e4567-e89b-12d3-a456-426614174000"
member_id: "M001"
coffee_id: "550e8400-e29b-41d4-a716-446655440000"
quantity: 2
total_amount: 300.00
points_earned: 6
created_at: 2026-01-22 10:30:00
```

---

## Design Principles

### Normalization
- **1NF:** All fields contain atomic values
- **2NF:** No partial dependencies (all non-key attributes depend on entire primary key)
- **3NF:** No transitive dependencies (no non-key attribute depends on another non-key attribute)

### Data Integrity
- **Primary Keys:** Ensure unique identification
- **Foreign Keys:** Maintain referential integrity
- **CHECK Constraints:** Prevent invalid data (negative points, zero quantities)
- **CASCADE:** When member deleted, their purchases also deleted
- **RESTRICT:** Cannot delete coffee if it has purchase records

### Scalability
- UUIDs for `coffees` and `purchases` allow distributed systems
- Indexed foreign keys for fast JOIN operations
- Timestamps for audit trails and reporting

### API Support
All required APIs are supported:
-  Add/list coffees
-  Add/get members
-  Record purchases
-  Calculate points automatically
-  Track purchase history

---

## Sample Queries

### Get member's total points
```sql
SELECT member_id, name, points 
FROM members 
WHERE member_id = 'M001';
```

### Get member's purchase history
```sql
SELECT p.id, c.name AS coffee, p.quantity, p.total_amount, p.points_earned, p.created_at
FROM purchases p
JOIN coffees c ON p.coffee_id = c.id
WHERE p.member_id = 'M001'
ORDER BY p.created_at DESC;
```

### Calculate total points earned by a member (verification)
```sql
SELECT member_id, SUM(points_earned) AS total_points_earned
FROM purchases
WHERE member_id = 'M001'
GROUP BY member_id;
```

### Get all coffees with prices
```sql
SELECT id, name, price 
FROM coffees 
ORDER BY name;
```

---

## Extension Possibilities

This schema can easily support future features:
- **Discounts Table:** Track point redemptions separately
- **Multiple Items per Purchase:** Add `purchase_items` junction table
- **Price History:** Add `coffee_price_history` table for tracking price changes
- **Membership Tiers:** Add `tier` field to members (Bronze, Silver, Gold)
- **Staff Table:** Add employee records for audit trails

---

## Technical Notes

- **UUID Generation:** Uses `uuid-ossp` PostgreSQL extension
- **Decimal Precision:** NUMERIC(10,2) supports up to 99,999,999.99 taka
- **Timezone:** Timestamps use server timezone (consider using TIMESTAMPTZ for production)
- **Performance:** Indexes on frequently queried columns (member_id, created_at)

---

## Database Initialization

This schema is automatically applied when running:
```bash
docker compose up
```

The `Init.sql` file is mounted to PostgreSQL's entrypoint, creating all tables on first startup.