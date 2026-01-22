CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- MEMBER INFORMATION TABLE
CREATE TABLE members (
    member_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL UNIQUE,
    points INT DEFAULT 0 CHECK (points >= 0)
);

--MENU ITEMS TABLE
CREATE TABLE coffees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0)
);

--PURCHASES TABLE
CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id VARCHAR(50) NOT NULL,
    coffee_id UUID NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    points_earned INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    --Foreign key constraints
    CONSTRAINT fk_member
        FOREIGN KEY (member_id) 
        REFERENCES members(member_id)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_coffee
        FOREIGN KEY (coffee_id)
        REFERENCES coffees(id)
        ON DELETE RESTRICT
);

-- Indexes for faster queries
CREATE INDEX idx_purchases_member_id ON purchases(member_id);
CREATE INDEX idx_purchases_created_at ON purchases(created_at);
CREATE INDEX idx_members_phone ON members(phone);

-- Comments for documentation
COMMENT ON TABLE members IS 'Stores customer membership data and bonus point balances';
COMMENT ON TABLE coffees IS 'Stores coffee menu items with current prices';
COMMENT ON TABLE purchases IS 'Records all purchase transactions with point calculations';

COMMENT ON COLUMN members.member_id IS 'Unique member identifier provided via API';
COMMENT ON COLUMN members.points IS 'Current bonus point balance (50 taka = 1 point)';
COMMENT ON COLUMN coffees.id IS 'Auto-generated UUID for coffee items';
COMMENT ON COLUMN purchases.points_earned IS 'Points earned from this purchase (total_amount / 50)';