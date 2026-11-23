const P = (id, name, category, price, emoji, color, rating, description, stock = 20) =>
  ({ id, name, category, price, emoji, color, rating, description, stock })

export const products = [
  P(1, 'Wireless Headphones', 'Electronics', 89.99, '🎧', '#dbeafe', 4.5, 'Over-ear Bluetooth headphones with active noise cancelling and 30-hour battery life.'),
  P(2, 'Smart Watch', 'Electronics', 149.0, '⌚', '#e0e7ff', 4.3, 'Track workouts, sleep and notifications with a bright always-on display.'),
  P(3, 'Portable Speaker', 'Electronics', 59.5, '🔊', '#cffafe', 4.4, 'Waterproof speaker with deep bass and 12 hours of playtime.'),
  P(4, 'Mechanical Keyboard', 'Electronics', 74.0, '⌨️', '#e2e8f0', 4.6, 'Hot-swappable tactile switches with RGB backlight.'),
  P(5, 'Running Shoes', 'Fashion', 79.99, '👟', '#fee2e2', 4.2, 'Lightweight breathable running shoes with responsive cushioning.'),
  P(6, 'Denim Jacket', 'Fashion', 64.0, '🧥', '#dbeafe', 4.1, 'Classic fit denim jacket with a soft inner lining.'),
  P(7, 'Leather Backpack', 'Fashion', 112.0, '🎒', '#fef3c7', 4.7, 'Handcrafted full-grain leather backpack with laptop sleeve.'),
  P(8, 'Sunglasses', 'Fashion', 39.0, '🕶️', '#fae8ff', 4.0, 'Polarized UV400 sunglasses with a durable frame.'),
  P(9, 'Ceramic Mug Set', 'Home', 28.0, '☕', '#ffedd5', 4.5, 'Set of four hand-glazed 12oz ceramic mugs.'),
  P(10, 'Scented Candle', 'Home', 18.5, '🕯️', '#fef9c3', 4.6, 'Soy wax candle with notes of cedar and vanilla. 40-hour burn.'),
  P(11, 'Indoor Plant', 'Home', 24.0, '🪴', '#dcfce7', 4.8, 'Easy-care potted plant that brightens any room.'),
  P(12, 'Desk Lamp', 'Home', 45.0, '💡', '#fef3c7', 4.3, 'Adjustable LED desk lamp with 5 brightness levels and USB charging.'),
  P(13, 'Yoga Mat', 'Sports', 32.0, '🧘', '#ccfbf1', 4.4, 'Non-slip 6mm yoga mat with carrying strap.'),
  P(14, 'Water Bottle', 'Sports', 21.0, '🍶', '#e0f2fe', 4.5, 'Insulated stainless steel bottle keeps drinks cold for 24 hours.'),
  P(15, 'Football', 'Sports', 26.0, '⚽', '#dcfce7', 4.2, 'Size 5 match-quality football with a durable cover.', 5),
  P(16, 'Dumbbell Set', 'Sports', 95.0, '🏋️', '#e2e8f0', 4.6, 'Adjustable dumbbells from 2 to 20 kg.', 0),
]

