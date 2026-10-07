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
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Bike,
  TrendingUp,
  Award,
  Navigation,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  MapPin,
  Store,
  DollarSign,
  User,
  Home,
  ShoppingBag,
  Compass,
  PackageCheck,
  Check,
  X,
  LogOut,
  ShieldCheck,
} from 'lucide-react-native';

const COLORS = {
  primary: '#059669', // Emerald Green for Rider
  primaryLight: '#D1FAE5',
  accent: '#FF385C',
  background: '#F8F9FA',
  cardBackground: '#FFFFFF',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  white: '#FFFFFF',
  black: '#000000',
  starYellow: '#FFB800',
  danger: '#EF4444',
};

type ScreenTab = 'home' | 'requests' | 'pickup' | 'delivery' | 'earnings' | 'history' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<ScreenTab>('home');
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Active delivery task state
  const [taskState, setTaskState] = useState<'idle' | 'accepted' | 'picked_up' | 'delivered'>('idle');
  const [todayEarnings, setTodayEarnings] = useState<number>(1240);
  const [todayOrders, setTodayOrders] = useState<number>(14);

  const handleAcceptRequest = () => {
    setTaskState('accepted');
    setActiveTab('pickup');
  };

  const handleConfirmPickup = () => {
    setTaskState('picked_up');
    setActiveTab('delivery');
  };

  const handleConfirmDelivery = () => {
    setTaskState('delivered');
    setTodayEarnings((prev) => prev + 85);
    setTodayOrders((prev) => prev + 1);
    alert('🎉 Delivery Complete! You earned +₹85');
    setTaskState('idle');
    setActiveTab('home');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" backgroundColor="#FFFFFF" />

        {/* Top Header Bar */}
        <View style={styles.topHeader}>
          <View style={styles.brandGroup}>
            <View style={styles.logoCircle}>
              <Bike size={20} color={COLORS.white} />
            </View>
            <View>
              <Text style={styles.brandName}>CraveDash Rider</Text>
              <Text style={styles.brandSub}>Delivery Partner App</Text>
            </View>
          </View>

          <View style={styles.onlineToggleGroup}>
            <Text style={[styles.onlineStatusText, isOnline ? styles.textOnline : styles.textOffline]}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </Text>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
              thumbColor={isOnline ? COLORS.primary : COLORS.textMuted}
            />
          </View>
        </View>

        {/* Dynamic Screen Content */}
        <View style={styles.screenBody}>
          {activeTab === 'home' && (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
              {/* Status Banner */}
              <View style={[styles.statusBanner, isOnline ? styles.bgOnline : styles.bgOffline]}>
                <View style={styles.bannerDot} />
                <Text style={styles.bannerText}>
                  {isOnline ? "You're Online & Looking for Delivery Requests..." : "You're Offline. Turn on toggle to start working."}
                </Text>
              </View>

              {/* Today's Stats Cards */}
              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <View style={styles.statIconBox}>
                    <TrendingUp size={20} color={COLORS.primary} />
                  </View>
                  <Text style={styles.statVal}>₹{todayEarnings}</Text>
                  <Text style={styles.statLbl}>Today's Earnings</Text>
                </View>

                <View style={styles.statBox}>
                  <View style={[styles.statIconBox, { backgroundColor: '#FFEBF0' }]}>
                    <ShoppingBag size={20} color={COLORS.accent} />
                  </View>
                  <Text style={styles.statVal}>{todayOrders}</Text>
                  <Text style={styles.statLbl}>Completed Orders</Text>
                </View>

                <View style={styles.statBox}>
                  <View style={[styles.statIconBox, { backgroundColor: '#FEF3C7' }]}>
                    <Compass size={20} color="#D97706" />
                  </View>
                  <Text style={styles.statVal}>42.5 km</Text>
                  <Text style={styles.statLbl}>Today's Distance</Text>
                </View>

                <View style={styles.statBox}>
                  <View style={[styles.statIconBox, { backgroundColor: '#FFF8E5' }]}>
                    <Award size={20} color={COLORS.starYellow} />
                  </View>
                  <Text style={styles.statVal}>4.9 ⭐</Text>
                  <Text style={styles.statLbl}>Rider Rating</Text>
                </View>
              </View>

              {/* Delivery Requests Alert */}
              {isOnline && (
                <TouchableOpacity
                  style={styles.requestAlertCard}
                  onPress={() => setActiveTab('requests')}
                  activeOpacity={0.9}
                >
                  <View style={styles.alertLeft}>
                    <View style={styles.pulseDot} />
                    <View>
                      <Text style={styles.alertTitle}>New Delivery Request!</Text>
                      <Text style={styles.alertSub}>The Royal Biryani House • Est. ₹85</Text>
                    </View>
                  </View>
                  <View style={styles.viewBtn}>
                    <Text style={styles.viewBtnText}>View Request</Text>
                  </View>
                </TouchableOpacity>
              )}

              {/* Live Map Hotspot */}
              <View style={styles.mapCard}>
                <View style={styles.mapHeader}>
                  <MapPin size={16} color={COLORS.primary} />
                  <Text style={styles.mapHeaderTitle}>High Demand Zone: Connaught Place</Text>
                </View>
                <View style={styles.mapCanvas}>
                  <View style={styles.roadHorizontal} />
                  <View style={styles.roadVertical} />
                  <View style={styles.hotspot1} />
                  <View style={styles.riderPin}>
                    <Navigation size={18} color={COLORS.white} style={{ transform: [{ rotate: '45deg' }] }} />
                  </View>
                </View>
              </View>
            </ScrollView>
          )}

          {activeTab === 'requests' && (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
              <Text style={styles.pageTitle}>Incoming Delivery Requests</Text>

              <View style={styles.reqCard}>
                <View style={styles.reqHeader}>
                  <View style={styles.earnBadge}>
                    <Text style={styles.earnLabel}>ESTIMATED EARNINGS</Text>
                    <Text style={styles.earnVal}>+₹85</Text>
                  </View>
                  <View style={styles.timerBadge}>
                    <Clock size={14} color={COLORS.accent} />
                    <Text style={styles.timerText}>28s left</Text>
                  </View>
                </View>

                <View style={styles.locRow}>
                  <View style={styles.storeIconCircle}>
                    <Store size={16} color={COLORS.white} />
                  </View>
                  <View>
                    <Text style={styles.locTag}>PICKUP (0.8 km away)</Text>
                    <Text style={styles.locName}>The Royal Biryani House</Text>
                    <Text style={styles.locAddr}>45 Connaught Place, Inner Circle</Text>
                  </View>
                </View>

                <View style={styles.locRow} style={{ marginTop: 12 }}>
                  <View style={styles.homeIconCircle}>
                    <Home size={16} color={COLORS.white} />
                  </View>
                  <View>
                    <Text style={styles.locTag}>DROP (3.4 km trip)</Text>
                    <Text style={styles.locName}>Aarav Sharma</Text>
                    <Text style={styles.locAddr}>Flat 402, Green Valley Apartments, Sector 62</Text>
                  </View>
                </View>

                <View style={styles.metaBox}>
                  <Text style={styles.metaTxt}>Est. Time: 22 mins</Text>
                  <Text style={styles.metaTxt}>Order: ₹533 (2 items)</Text>
                </View>

                <View style={styles.reqActions}>
                  <TouchableOpacity style={styles.rejectBtn} onPress={() => setActiveTab('home')}>
                    <X size={16} color={COLORS.danger} />
                    <Text style={styles.rejectTxt}>Decline</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.acceptBtn} onPress={handleAcceptRequest}>
                    <Check size={18} color={COLORS.white} />
                    <Text style={styles.acceptTxt}>Accept Order</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          )}

          {activeTab === 'pickup' && (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
              <Text style={styles.pageTitle}>Step 1: Navigate & Pickup Order</Text>

              <View style={styles.mapCard}>
                <View style={styles.mapCanvas}>
                  <View style={styles.roadHorizontal} />
                  <View style={styles.riderPin} style={{ left: '30%' }}>
                    <Navigation size={18} color={COLORS.white} style={{ transform: [{ rotate: '45deg' }] }} />
                  </View>
                  <View style={styles.storeIconCircle} style={{ position: 'absolute', right: '30%', width: 36, height: 36 }}>
                    <Store size={18} color={COLORS.white} />
                  </View>
                </View>

                <View style={styles.navRow}>
                  <TouchableOpacity style={styles.navBtn} onPress={() => alert('Starting Google Maps navigation...')}>
                    <Navigation size={16} color={COLORS.white} />
                    <Text style={styles.navBtnTxt}>Start Navigation</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.callStoreBtn} onPress={() => alert('Calling store...')}>
                    <Phone size={16} color={COLORS.textPrimary} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.locTag}>RESTAURANT DETAILS</Text>
                <Text style={styles.infoTitle}>The Royal Biryani House</Text>
                <Text style={styles.infoSub}>45 Connaught Place, Inner Circle</Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.checklistHead}>Verify Order Items (#ORD-98421)</Text>
                <View style={styles.checkItem}>
                  <CheckCircle2 size={16} color={COLORS.primary} />
                  <Text style={styles.checkItemTxt}>1x Hyderabadi Chicken Dum Biryani (Medium)</Text>
                </View>
                <View style={styles.checkItem}>
                  <CheckCircle2 size={16} color={COLORS.primary} />
                  <Text style={styles.checkItemTxt}>1x Extra Cucumber Raita</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.ctaBtn} onPress={handleConfirmPickup}>
                <PackageCheck size={20} color={COLORS.white} style={{ marginRight: 6 }} />
                <Text style={styles.ctaTxt}>Confirm Order Pickup</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {activeTab === 'delivery' && (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
              <Text style={styles.pageTitle}>Step 2: Deliver to Customer</Text>

              <View style={styles.mapCard}>
                <View style={styles.mapCanvas}>
                  <View style={styles.roadHorizontal} />
                  <View style={styles.riderPin} style={{ left: '40%' }}>
                    <Navigation size={18} color={COLORS.white} style={{ transform: [{ rotate: '45deg' }] }} />
                  </View>
                  <View style={styles.homeIconCircle} style={{ position: 'absolute', right: '25%', width: 36, height: 36 }}>
                    <Home size={18} color={COLORS.white} />
                  </View>
                </View>

                <View style={styles.navRow}>
                  <TouchableOpacity style={styles.navBtn} onPress={() => alert('Navigating to Customer address...')}>
                    <Navigation size={16} color={COLORS.white} />
                    <Text style={styles.navBtnTxt}>Navigate to Customer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.callStoreBtn} onPress={() => alert('Calling Customer...')}>
                    <Phone size={16} color={COLORS.textPrimary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.callStoreBtn} onPress={() => alert('Opening Chat...')}>
                    <MessageSquare size={16} color={COLORS.textPrimary} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.locTag}>CUSTOMER DROP ADDRESS</Text>
                <Text style={styles.infoTitle}>Aarav Sharma</Text>
                <Text style={styles.infoSub}>Flat 402, Green Valley Apartments, Sector 62</Text>
                <Text style={styles.payBadge}>Payment Status: PAID via UPI (₹533)</Text>
              </View>

              <TouchableOpacity style={[styles.ctaBtn, { backgroundColor: COLORS.accent }]} onPress={handleConfirmDelivery}>
                <CheckCircle2 size={20} color={COLORS.white} style={{ marginRight: 6 }} />
                <Text style={styles.ctaTxt}>Complete & Confirm Delivery</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {activeTab === 'earnings' && (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
              <Text style={styles.pageTitle}>Earnings Dashboard</Text>

              <View style={styles.earningsSummaryBox}>
                <Text style={styles.summaryLbl}>TODAY'S TOTAL EARNINGS</Text>
                <Text style={styles.summaryVal}>₹{todayEarnings}</Text>

                <View style={styles.breakdownRow}>
                  <View style={styles.breakItem}>
                    <Text style={styles.breakVal}>₹7,850</Text>
                    <Text style={styles.breakLbl}>This Week</Text>
                  </View>
                  <View style={styles.breakDivider} />
                  <View style={styles.breakItem}>
                    <Text style={styles.breakVal}>₹28,450</Text>
                    <Text style={styles.breakLbl}>This Month</Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Incentives & Tips Breakdown</Text>
                <View style={styles.lineRow}><span>Order Pay</span><span style={styles.bold}>₹980</span></View>
                <View style={styles.lineRow}><span>Customer Tips</span><span style={styles.bold}>₹160</span></View>
                <View style={styles.lineRow}><span>Peak Surge Bonus</span><span style={styles.bold}>₹100</span></View>
              </View>
            </ScrollView>
          )}

          {activeTab === 'profile' && (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
              <View style={styles.userCard}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' }} style={styles.avatar} />
                <Text style={styles.userName}>Kabir Verma</Text>
                <Text style={styles.userSub}>+91 98112 33445 • EV Rider</Text>

                <View style={styles.verifBadge}>
                  <ShieldCheck size={14} color={COLORS.primary} />
                  <Text style={styles.verifTxt}>Verified Delivery Partner</Text>
                </View>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Vehicle & Document Details</Text>
                <Text style={styles.infoSub}>Vehicle: Honda Activa EV (DL 01 CRAVE)</Text>
                <Text style={styles.infoSub}>Driving License: DL-14202100892 (Verified)</Text>
                <Text style={styles.infoSub}>Bank Account: HDFC Bank **** 8812</Text>
              </View>
            </ScrollView>
          )}
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navTab} onPress={() => setActiveTab('home')}>
            <Home size={20} color={activeTab === 'home' ? COLORS.primary : COLORS.textMuted} />
            <Text style={[styles.navLbl, activeTab === 'home' && styles.activeLbl]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navTab} onPress={() => setActiveTab('requests')}>
            <Clock size={20} color={activeTab === 'requests' ? COLORS.primary : COLORS.textMuted} />
            <Text style={[styles.navLbl, activeTab === 'requests' && styles.activeLbl]}>Requests</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navTab} onPress={() => setActiveTab('earnings')}>
            <TrendingUp size={20} color={activeTab === 'earnings' ? COLORS.primary : COLORS.textMuted} />
            <Text style={[styles.navLbl, activeTab === 'earnings' && styles.activeLbl]}>Earnings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navTab} onPress={() => setActiveTab('profile')}>
            <User size={20} color={activeTab === 'profile' ? COLORS.primary : COLORS.textMuted} />
            <Text style={[styles.navLbl, activeTab === 'profile' && styles.activeLbl]}>Profile</Text>
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
  onlineToggleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineStatusText: {
    fontSize: 11,
    fontWeight: '800',
    marginRight: 6,
  },
  textOnline: {
    color: COLORS.primary,
  },
  textOffline: {
    color: COLORS.textMuted,
  },
  screenBody: {
    flex: 1,
  },
  scrollPadding: {
    padding: 16,
    paddingBottom: 80,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  bgOnline: {
    backgroundColor: '#ECFDF5',
  },
  bgOffline: {
    backgroundColor: '#F3F4F6',
  },
  bannerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: 8,
  },
  bannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    width: '48%',
    backgroundColor: COLORS.cardBackground,
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statVal: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  statLbl: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  requestAlertCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  alertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    marginRight: 10,
  },
  alertTitle: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
  },
  alertSub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  viewBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewBtnText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
  },
  mapCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  mapHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: 6,
  },
  mapCanvas: {
    height: 140,
    backgroundColor: '#CBD5E1',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roadHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: COLORS.white,
  },
  roadVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 12,
    backgroundColor: COLORS.white,
  },
  hotspot1: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
  },
  riderPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  reqCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  reqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  earnBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  earnLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.primary,
  },
  earnVal: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBF0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timerText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.accent,
    marginLeft: 4,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  storeIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  homeIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  locTag: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  locName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  locAddr: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  metaBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 8,
    marginVertical: 12,
  },
  metaTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  reqActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 6,
  },
  rejectTxt: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.danger,
    marginLeft: 4,
  },
  acceptBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 6,
  },
  acceptTxt: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.white,
    marginLeft: 4,
  },
  navRow: {
    flexDirection: 'row',
    padding: 12,
  },
  navBtn: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 6,
  },
  navBtnTxt: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 4,
  },
  callStoreBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 12,
  },
  infoCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  infoSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  checklistHead: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  checkItemTxt: {
    fontSize: 13,
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  ctaTxt: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '900',
  },
  payBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 6,
  },
  earningsSummaryBox: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryLbl: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
  },
  summaryVal: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.white,
    marginVertical: 4,
  },
  breakdownRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  breakItem: {
    flex: 1,
    alignItems: 'center',
  },
  breakVal: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
  },
  breakLbl: {
    fontSize: 11,
    color: '#94A3B8',
  },
  breakDivider: {
    width: 1,
    backgroundColor: '#334155',
  },
  lineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
    fontSize: 13,
  },
  bold: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  userCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  userSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  verifBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
  },
  verifTxt: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    marginLeft: 4,
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
