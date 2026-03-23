-- Aggressive cleanup to avoid ANY data tangling
TRUNCATE order_items CASCADE;
TRUNCATE orders CASCADE;
TRUNCATE reviews CASCADE;
TRUNCATE products CASCADE;
TRUNCATE categories CASCADE;
TRUNCATE banners CASCADE;

INSERT INTO banners (title, description, image_url, link_url, sort_order, is_active) VALUES
('지금 가장 핫한 테크 아이템', '최신 성능으로 무장한 게이밍 기어 컬렉션', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop', '/products/3', 1, true),
('일상의 가치를 더하는 스마트폰', '압도적 카메라와 세련된 디자인의 만남', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1780&auto=format&fit=crop', '/products/2', 2, true),
('작업의 효율을 높이는 워크스테이션', '더 조용하고, 더 강력하게', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop', '/products/5', 3, true);

-- Categories
INSERT INTO categories (id, name) VALUES (1, '디지털 가전') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO categories (id, name) VALUES (2, '의류/잡화') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO categories (id, name) VALUES (3, '식품/리빙') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Products
INSERT INTO products (id, name, description, price, stock_quantity, status, category_id, image_url, content, created_at) 
VALUES (
    1,
    'iPhone 15 Pro Max', 
    '티타늄의 견고함과 최첨단 A17 Pro 칩셋의 만남.', 
    1900000.00, 15, 'ACTIVE', 1, 
    'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=1000\nhttps://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=1000\nhttps://images.unsplash.com/photo-1695048132803-518469850596?auto=format&fit=crop&q=80&w=1000', 
    '### 가벼움 속에 숨겨진 강력함\n항공우주 등급의 티타늄 디자인으로 역대 가장 가벼운 Pro 모델을 만나보세요. 48MP 메인 카메라와 눈부신 Super Retina XDR 디스플레이가 당신의 일상을 작품으로 만듭니다.\n\n* A17 Pro 칩 탑재\n* USB-C 커넥터 지원\n* 모든 것을 담아내는 프로 카메라 시스템',
    NOW()
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, image_url = EXCLUDED.image_url, content = EXCLUDED.content;

INSERT INTO products (id, name, description, price, stock_quantity, status, category_id, image_url, content, created_at) 
VALUES (
    2,
    'MacBook Air M3 13형', 
    '가장 가볍지만, 그 어느 때보다 강력합니다.', 
    1590000.00, 8, 'ACTIVE', 1, 
    'https://images.unsplash.com/photo-1517336714460-45b7dea04c04?auto=format&fit=crop&q=80&w=1000\nhttps://images.unsplash.com/photo-1611186871348-b1ec696e52c9?auto=format&fit=crop&q=80&w=1000', 
    '### 하루 종일 사용 가능한 배터리와 압도적 성능\n새로운 M3 칩으로 더 똑똑하고 빨라진 MacBook Air. 최대 18시간 지속되는 배터리 성능과 팬리스 디자인의 정숙함을 경험하세요.',
    NOW()
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, image_url = EXCLUDED.image_url, content = EXCLUDED.content;

INSERT INTO products (id, name, description, price, stock_quantity, status, category_id, image_url, content, created_at) 
VALUES (
    3,
    '헤비 코튼 오버사이즈 후디', 
    '매일 입고 싶은 포근한 착용감의 데일리 웨어.', 
    590000.00, 50, 'ACTIVE', 2, 
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000\nhttps://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1000', 
    '### 퀄리티가 다른 헤비 웨이트 원단\n축률을 최소화한 덤블 워싱 가공으로 세탁 후에도 변형이 적습니다. 자연스럽게 떨어지는 드롭 숄더 라인으로 트렌디한 무드를 완성하세요.',
    NOW()
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, image_url = EXCLUDED.image_url, content = EXCLUDED.content;

-- Reviews
INSERT INTO reviews (product_id, nickname, rating, content, created_at)
VALUES (1, '얼리어답터', 5, '와... 티타늄 진짜 가벼워요! 이전 모델 쓰다가 넘어왔는데 체감이 확 됩니다. 카메라 줌 성능도 미쳤어요 ㄷㄷ', NOW());

INSERT INTO reviews (product_id, nickname, rating, content, created_at)
VALUES (1, '앱등이사우루스', 4, '가격은 사악하지만 디스플레이가 너무 쨍하고 좋습니다. 발열도 이정도면 잘 잡은듯?', NOW());

INSERT INTO reviews (product_id, nickname, rating, content, created_at)
VALUES (2, '카페카공족', 5, '팬소리 안 나는 게 진짜 최고예요. M3 성능 말할 것도 없고 색상도 너무 영롱합니다.', NOW());



-- Shipping Addresses (for test users)
INSERT INTO shipping_addresses (user_id, name, recipient_name, phone, zipcode, address, detail, is_default) VALUES
('1', '우리집', '김로키', '010-1234-5678', '06236', '서울특별시 강남구 테헤란로 123', '스파크플러스 15층', true),
('1', '회사', '김로키', '010-1234-5678', '08501', '서울특별시 금천구 가산디지털2로 1', 'IT타워 1004호', false),
('2', '본가', '로키네', '010-9999-8888', '48058', '부산광역시 해운대구 우동 1', '아이파크 101동', true);
