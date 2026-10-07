import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Store,
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
  Plus,
  Edit2,
  Trash2,
  Tag,
  BarChart3,
  User,
  Power,
  Check,
  X,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Percent,
} from 'lucide-react-native';

const COLORS = {
  primary: '#7C3AED', // Royal Purple for Restaurant Partner
  primaryLight: '#F3E8FF',
  accent: '#FF385C',
  background: '#F8F9FA',
  cardBackground: '#FFFFFF',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  white: '#FFFFFF',
  starYellow: '#FFB800',
  vegGreen: '#00B562',
  danger: '#EF4444',
};

type ScreenTab = 'dashboard' | 'orders' | 'menu' | 'offers' | 'analytics';

export default function App() {
  const [activeTab, setActiveTab] = useState<ScreenTab>('dashboard');
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // Live Orders State
  const [orders, setOrders] = useState([
    {
      id: 'ORD-98421',
      customer: 'Aarav Sharma',
      items: '1x Hyderabadi Chicken Dum Biryani, 1x Extra Raita',
      total: 533,
      time: '7:15 PM (5 mins ago)',
      status: 'new', // new | preparing | ready
      payment: 'Paid via UPI',
    },
    {
      id: 'ORD-87120',
      customer: 'Ananya Roy',
      items: '1x Pepperoni Overload Pizza (Medium)',
      total: 464,
      time: '7:02 PM (18 mins ago)',
      status: 'preparing',
      payment: 'Paid via Card',
    },
  ]);

  // Live Menu Items State
  const [menuItems, setMenuItems] = useState([
    {
      id: '1',
      name: 'Hyderabadi Chicken Dum Biryani',
      category: 'Biryani',
      price: 340,
      inStock: true,
      rating: 4.9,
      type: 'non-veg',
      desc: 'Slow cooked fragrant basmati rice with succulent chicken.',
      prepTime: 20,
    },
    {
      id: '2',
      name: 'Special Mutton Dum Biryani',
      category: 'Biryani',
      price: 460,
      inStock: true,
      rating: 4.8,
      type: 'non-veg',
      desc: 'Tender baby lamb cooked in handi with saffron basmati rice.',
      prepTime: 25,
    },
    {
      id: '3',
      name: 'Paneer Tikka Dum Biryani',
      category: 'Biryani',
      price: 290,
      inStock: false,
      rating: 4.6,
      type: 'veg',
      desc: 'Charcoal grilled cottage cheese cubes in spiced rice.',
      prepTime: 18,
    },
    {
      id: '4',
      name: 'Chicken Galouti Kebab (4 pcs)',
      category: 'Starters',
      price: 320,
      inStock: true,
      rating: 4.7,
      type: 'non-veg',
      desc: 'Melt in mouth minced chicken kebabs.',
      prepTime: 15,
    },
  ]);

  // Add/Edit Dish Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingDishId, setEditingDishId] = useState<string | null>(null);

  // Form Fields
  const [dishName, setDishName] = useState('');
  const [dishCategory, setDishCategory] = useState('Biryani');
  const [dishPrice, setDishPrice] = useState('');
  const [dishType, setDishType] = useState<'veg' | 'non-veg'>('veg');
  const [dishDesc, setDishDesc] = useState('');
  const [dishPrepTime, setDishPrepTime] = useState('15');

  const categories = ['Starters', 'Main Course', 'Biryani', 'Pizza', 'Burgers', 'Desserts', 'Beverages'];

  const openAddDishModal = (dish?: any) => {
    if (dish) {
      setEditingDishId(dish.id);
      setDishName(dish.name);
      setDishCategory(dish.category);
      setDishPrice(dish.price.toString());
      setDishType(dish.type || 'veg');
      setDishDesc(dish.desc || '');
      setDishPrepTime((dish.prepTime || 15).toString());
    } else {
      setEditingDishId(null);
      setDishName('');
      setDishCategory('Biryani');
      setDishPrice('');
      setDishType('veg');
      setDishDesc('');
      setDishPrepTime('15');
    }
    setShowAddModal(true);
  };

  const handleSaveDish = () => {
    if (!dishName || !dishPrice) {
      alert('Please enter Dish Name and Price');
      return;
    }

    const numericPrice = parseFloat(dishPrice) || 0;
    const numericPrepTime = parseInt(dishPrepTime, 10) || 15;

    if (editingDishId) {
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === editingDishId
            ? {
                ...item,
                name: dishName,
                category: dishCategory,
                price: numericPrice,
                type: dishType,
                desc: dishDesc,
                prepTime: numericPrepTime,
              }
            : item
        )
      );
    } else {
      const newItem = {
        id: `dish-${Date.now()}`,
        name: dishName,
        category: dishCategory,
        price: numericPrice,
        inStock: true,
        rating: 5.0,
        type: dishType,
        desc: dishDesc,
        prepTime: numericPrepTime,
      };
      setMenuItems((prev) => [newItem, ...prev]);
    }

    setShowAddModal(false);
  };

  const handleDeleteDish = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleItemStock = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, inStock: !item.inStock } : item))
    );
  };

  const updateOrderStatus = (id: string, nextStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: nextStatus } : o))
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" backgroundColor="#FFFFFF" />

        {/* Top Header */}
        <View style={styles.topHeader}>
          <View style={styles.brandGroup}>
            <View style={styles.logoCircle}>
              <Store size={20} color={COLORS.white} />
            </View>
            <View>
              <Text style={styles.brandName}>The Royal Biryani House</Text>
              <Text style={styles.brandSub}>CraveDash Partner Portal</Text>
            </View>
          </View>

          <View style={styles.storeToggleGroup}>
            <Text style={[styles.storeStatusText, isOpen ? styles.txtOpen : styles.txtClosed]}>
              {isOpen ? 'STORE OPEN' : 'CLOSED'}
            </Text>
            <Switch
              value={isOpen}
              onValueChange={setIsOpen}
              trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
              thumbColor={isOpen ? COLORS.primary : COLORS.textMuted}
            />
          </View>
        </View>

        {/* Screen Body */}
        <View style={styles.screenBody}>
          {activeTab === 'dashboard' && (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
              {/* Store Status Banner */}
              <View style={[styles.banner, isOpen ? styles.bgOpen : styles.bgClosed]}>
                <View style={styles.bannerDot} />
                <Text style={styles.bannerTxt}>
                  {isOpen ? 'Store is Open & Accepting Online Orders' : 'Store is Closed for Orders'}
                </Text>
              </View>

              {/* Revenue Card */}
              <View style={styles.revenueCard}>
                <Text style={styles.revLbl}>TODAY'S REVENUE</Text>
                <Text style={styles.revVal}>₹18,450</Text>
                <Text style={styles.revSub}>+14.2% higher than yesterday</Text>

                <View style={styles.grid4}>
                  <View style={styles.gridItem}>
                    <Text style={styles.gridVal}>124</Text>
                    <Text style={styles.gridLbl}>Total Orders</Text>
                  </View>
                  <View style={styles.gridItem}>
                    <Text style={[styles.gridVal, { color: COLORS.accent }]}>8</Text>
                    <Text style={styles.gridLbl}>Pending</Text>
                  </View>
                  <View style={styles.gridItem}>
                    <Text style={[styles.gridVal, { color: COLORS.vegGreen }]}>110</Text>
                    <Text style={styles.gridLbl}>Completed</Text>
                  </View>
                  <View style={styles.gridItem}>
                    <Text style={[styles.gridVal, { color: COLORS.danger }]}>6</Text>
                    <Text style={styles.gridLbl}>Cancelled</Text>
                  </View>
                </View>
              </View>

              {/* Quick Actions */}
              <View style={styles.quickGrid}>
                <TouchableOpacity style={styles.quickBtn} onPress={() => setActiveTab('orders')}>
                  <ShoppingBag size={20} color={COLORS.primary} />
                  <Text style={styles.quickTxt}>Kitchen Orders (8)</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickBtn} onPress={() => setActiveTab('menu')}>
                  <Store size={20} color={COLORS.primary} />
                  <Text style={styles.quickTxt}>Menu Manager ({menuItems.length})</Text>
                </TouchableOpacity>
              </View>

              {/* Live Kitchen Orders */}
              <Text style={styles.sectionHeading}>Live Kitchen Orders (KDS)</Text>
              {orders.map((ord) => (
                <View key={ord.id} style={styles.orderCard}>
                  <View style={styles.ordHead}>
                    <Text style={styles.ordId}>{ord.id} • {ord.customer}</Text>
                    <Text style={styles.ordTime}>{ord.time}</Text>
                  </View>
                  <Text style={styles.ordItems}>{ord.items}</Text>
                  <Text style={styles.ordTotal}>Total: ₹{ord.total} • {ord.payment}</Text>

                  <View style={styles.ordActions}>
                    {ord.status === 'new' && (
                      <TouchableOpacity
                        style={styles.actionBtnPrimary}
                        onPress={() => updateOrderStatus(ord.id, 'preparing')}
                      >
                        <Check size={16} color={COLORS.white} />
                        <Text style={styles.btnTxt}>Accept & Start Preparing</Text>
                      </TouchableOpacity>
                    )}

                    {ord.status === 'preparing' && (
                      <TouchableOpacity
                        style={[styles.actionBtnPrimary, { backgroundColor: COLORS.vegGreen }]}
                        onPress={() => updateOrderStatus(ord.id, 'ready')}
                      >
                        <CheckCircle2 size={16} color={COLORS.white} />
                        <Text style={styles.btnTxt}>Mark as Ready for Pickup</Text>
                      </TouchableOpacity>
                    )}

                    {ord.status === 'ready' && (
                      <View style={styles.readyBadge}>
                        <CheckCircle2 size={16} color={COLORS.vegGreen} />
                        <Text style={styles.readyTxt}>Ready! Waiting for Delivery Driver</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          {activeTab === 'orders' && (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
              <Text style={styles.pageTitle}>Kitchen Order System (KDS)</Text>
              {orders.map((ord) => (
                <View key={ord.id} style={styles.orderCard}>
                  <Text style={styles.ordId}>{ord.id} • {ord.customer}</Text>
                  <Text style={styles.ordItems}>{ord.items}</Text>
                  <Text style={styles.ordTotal}>Total: ₹{ord.total}</Text>
                </View>
              ))}
            </ScrollView>
          )}

          {activeTab === 'menu' && (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
              <View style={styles.pageHeadRow}>
                <View>
                  <Text style={styles.pageTitle}>Menu & Stock Manager</Text>
                  <Text style={styles.pageSubTitle}>{menuItems.length} dishes in menu</Text>
                </View>
                <TouchableOpacity style={styles.addDishBtn} onPress={() => openAddDishModal()}>
                  <Plus size={16} color={COLORS.white} />
                  <Text style={styles.addDishTxt}>+ Add New Dish</Text>
                </TouchableOpacity>
              </View>

              {menuItems.map((item) => (
                <View key={item.id} style={styles.menuRow}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <View style={styles.itemTitleRow}>
                      <View
                        style={[
                          styles.vegBox,
                          { borderColor: item.type === 'veg' ? COLORS.vegGreen : COLORS.danger },
                        ]}
                      >
                        <View
                          style={[
                            styles.vegDot,
                            { backgroundColor: item.type === 'veg' ? COLORS.vegGreen : COLORS.danger },
                          ]}
                        />
                      </View>
                      <Text style={styles.itemName}>{item.name}</Text>
                    </View>

                    <Text style={styles.itemCat}>{item.category} • ₹{item.price} • {item.prepTime || 15} mins prep</Text>
                    {item.desc ? <Text style={styles.itemDesc}>{item.desc}</Text> : null}

                    {/* Action buttons */}
                    <View style={styles.itemActionGroup}>
                      <TouchableOpacity
                        style={styles.editBtn}
                        onPress={() => openAddDishModal(item)}
                      >
                        <Edit2 size={12} color={COLORS.primary} />
                        <Text style={styles.editTxt}>Edit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => handleDeleteDish(item.id)}
                      >
                        <Trash2 size={12} color={COLORS.danger} />
                        <Text style={styles.deleteTxt}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.stockToggle}>
                    <Text style={[styles.stockTxt, item.inStock ? styles.txtInStock : styles.txtOutStock]}>
                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </Text>
                    <Switch
                      value={item.inStock}
                      onValueChange={() => toggleItemStock(item.id)}
                      trackColor={{ false: COLORS.border, true: '#D1FAE5' }}
                      thumbColor={item.inStock ? COLORS.vegGreen : COLORS.danger}
                    />
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          {activeTab === 'offers' && (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
              <Text style={styles.pageTitle}>Promo Coupons & Discounts</Text>

              <View style={styles.offerCard}>
                <View style={styles.codeRow}>
                  <Text style={styles.codeTxt}>FIRST50</Text>
                  <Text style={styles.activeBadge}>ACTIVE</Text>
                </View>
                <Text style={styles.offerHead}>50% OFF on First Order</Text>
                <Text style={styles.offerDesc}>Min Order ₹199 • Max Discount ₹120</Text>
              </View>

              <View style={styles.offerCard}>
                <View style={styles.codeRow}>
                  <Text style={styles.codeTxt}>WELCOME100</Text>
                  <Text style={styles.activeBadge}>ACTIVE</Text>
                </View>
                <Text style={styles.offerHead}>Flat ₹100 Discount</Text>
                <Text style={styles.offerDesc}>Min Order ₹399</Text>
              </View>
            </ScrollView>
          )}

          {activeTab === 'analytics' && (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
              <Text style={styles.pageTitle}>Performance Analytics</Text>

              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Top Selling Dishes This Week</Text>
                <View style={styles.rankRow}><span>1. Hyderabadi Chicken Dum Biryani</span><span style={styles.bold}>48 orders</span></View>
                <View style={styles.rankRow}><span>2. Special Mutton Dum Biryani</span><span style={styles.bold}>32 orders</span></View>
                <View style={styles.rankRow}><span>3. Chicken Galouti Kebab</span><span style={styles.bold}>24 orders</span></View>
              </View>
            </ScrollView>
          )}
        </View>

        {/* Interactive Add / Edit Dish Modal */}
        <Modal visible={showAddModal} animationType="slide" transparent onRequestClose={() => setShowAddModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHead}>
                <Text style={styles.modalTitle}>{editingDishId ? 'Edit Menu Item' : 'Add New Menu Item'}</Text>
                <TouchableOpacity onPress={() => setShowAddModal(false)}>
                  <X size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                {/* Food Type Selector (Veg / Non-Veg) */}
                <Text style={styles.label}>Food Type</Text>
                <View style={styles.typeRow}>
                  <TouchableOpacity
                    style={[styles.typeChip, dishType === 'veg' && styles.activeVegChip]}
                    onPress={() => setDishType('veg')}
                  >
                    <View style={[styles.vegBox, { borderColor: COLORS.vegGreen }]}>
                      <View style={[styles.vegDot, { backgroundColor: COLORS.vegGreen }]} />
                    </View>
                    <Text style={[styles.typeText, dishType === 'veg' && styles.activeTypeTxt]}>Pure Veg</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.typeChip, dishType === 'non-veg' && styles.activeNonVegChip]}
                    onPress={() => setDishType('non-veg')}
                  >
                    <View style={[styles.vegBox, { borderColor: COLORS.danger }]}>
                      <View style={[styles.vegDot, { backgroundColor: COLORS.danger }]} />
                    </View>
                    <Text style={[styles.typeText, dishType === 'non-veg' && styles.activeTypeTxt]}>Non-Veg</Text>
                  </TouchableOpacity>
                </View>

                {/* Dish Name */}
                <Text style={styles.label}>Dish Name *</Text>
                <TextInput
                  style={styles.input}
                  value={dishName}
                  onChangeText={setDishName}
                  placeholder="e.g. Paneer Butter Masala"
                  placeholderTextColor={COLORS.textMuted}
                />

                {/* Category */}
                <Text style={styles.label}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.catPill, dishCategory === cat && styles.activeCatPill]}
                      onPress={() => setDishCategory(cat)}
                    >
                      <Text style={[styles.catPillTxt, dishCategory === cat && styles.activeCatPillTxt]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Price & Prep Time Row */}
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Price (₹) *</Text>
                    <TextInput
                      style={styles.input}
                      value={dishPrice}
                      onChangeText={setDishPrice}
                      placeholder="e.g. 290"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Prep Time (mins)</Text>
                    <TextInput
                      style={styles.input}
                      value={dishPrepTime}
                      onChangeText={setDishPrepTime}
                      placeholder="e.g. 15"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* Description */}
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, { height: 70, textAlignVertical: 'top' }]}
                  value={dishDesc}
                  onChangeText={setDishDesc}
                  placeholder="Enter dish description & ingredients..."
                  multiline
                />

                {/* Submit CTA */}
                <TouchableOpacity style={styles.saveCta} onPress={handleSaveDish} activeOpacity={0.85}>
                  <Text style={styles.saveCtaTxt}>{editingDishId ? 'Save Changes' : '+ Add Item to Menu'}</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navTab} onPress={() => setActiveTab('dashboard')}>
            <BarChart3 size={20} color={activeTab === 'dashboard' ? COLORS.primary : COLORS.textMuted} />
            <Text style={[styles.navLbl, activeTab === 'dashboard' && styles.activeLbl]}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navTab} onPress={() => setActiveTab('orders')}>
            <ShoppingBag size={20} color={activeTab === 'orders' ? COLORS.primary : COLORS.textMuted} />
            <Text style={[styles.navLbl, activeTab === 'orders' && styles.activeLbl]}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navTab} onPress={() => setActiveTab('menu')}>
            <Store size={20} color={activeTab === 'menu' ? COLORS.primary : COLORS.textMuted} />
            <Text style={[styles.navLbl, activeTab === 'menu' && styles.activeLbl]}>Menu</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navTab} onPress={() => setActiveTab('offers')}>
            <Tag size={20} color={activeTab === 'offers' ? COLORS.primary : COLORS.textMuted} />
            <Text style={[styles.navLbl, activeTab === 'offers' && styles.activeLbl]}>Offers</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navTab} onPress={() => setActiveTab('analytics')}>
            <TrendingUp size={20} color={activeTab === 'analytics' ? COLORS.primary : COLORS.textMuted} />
            <Text style={[styles.navLbl, activeTab === 'analytics' && styles.activeLbl]}>Analytics</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  brandSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  storeToggleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeStatusText: {
    fontSize: 11,
    fontWeight: '800',
    marginRight: 6,
  },
  txtOpen: {
    color: COLORS.primary,
  },
  txtClosed: {
    color: COLORS.danger,
  },
  screenBody: {
    flex: 1,
  },
  scrollPadding: {
    padding: 16,
    paddingBottom: 80,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  bgOpen: {
    backgroundColor: COLORS.primaryLight,
  },
  bgClosed: {
    backgroundColor: '#FEE2E2',
  },
  bannerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: 8,
  },
  bannerTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  revenueCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  revLbl: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
  },
  revVal: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.white,
    marginVertical: 4,
  },
  revSub: {
    fontSize: 11,
    color: COLORS.vegGreen,
    fontWeight: '700',
  },
  grid4: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  gridItem: {
    alignItems: 'center',
  },
  gridVal: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.white,
  },
  gridLbl: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  quickGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardBackground,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginHorizontal: 4,
  },
  quickTxt: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginLeft: 6,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  orderCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  ordHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  ordId: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  ordTime: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  ordItems: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  ordTotal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 6,
  },
  ordActions: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  actionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnTxt: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 6,
  },
  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 10,
  },
  readyTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.vegGreen,
    marginLeft: 6,
  },
  pageHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  pageSubTitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  addDishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addDishTxt: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBackground,
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vegBox: {
    width: 12,
    height: 12,
    borderWidth: 1.5,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  vegDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  itemCat: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  itemDesc: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  itemActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
  },
  editTxt: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 3,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  deleteTxt: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.danger,
    marginLeft: 3,
  },
  stockToggle: {
    alignItems: 'flex-end',
  },
  stockTxt: {
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 2,
  },
  txtInStock: {
    color: COLORS.vegGreen,
  },
  txtOutStock: {
    color: COLORS.danger,
  },
  offerCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  codeTxt: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  activeBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.vegGreen,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  offerHead: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  offerDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  rankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
    fontSize: 12,
  },
  bold: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingBottom: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  modalBody: {
    maxHeight: 450,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 4,
    marginTop: 8,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  activeVegChip: {
    backgroundColor: '#ECFDF5',
    borderColor: COLORS.vegGreen,
  },
  activeNonVegChip: {
    backgroundColor: '#FEE2E2',
    borderColor: COLORS.danger,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  activeTypeTxt: {
    color: COLORS.textPrimary,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  activeCatPill: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  catPillTxt: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  activeCatPillTxt: {
    color: COLORS.white,
    fontWeight: '800',
  },
  saveCta: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  saveCtaTxt: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  bottomNav: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: COLORS.cardBackground,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navTab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navLbl: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginTop: 2,
  },
  activeLbl: {
    color: COLORS.primary,
    fontWeight: '800',
  },
});
