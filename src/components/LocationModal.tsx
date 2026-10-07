import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { X, MapPin, Home, Briefcase, Plus, Check } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { Address } from '../types';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ visible, onClose }) => {
  const { addresses, selectedAddress, setSelectedAddress, addAddress } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);

  const [title, setTitle] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [pincode, setPincode] = useState('110001');

  const handleSaveAddress = () => {
    if (!line1) return;
    addAddress({
      title,
      addressLine1: line1,
      addressLine2: line2,
      city,
      pincode,
      latitude: 28.6300,
      longitude: 77.2150,
    });
    setLine1('');
    setLine2('');
    setShowAddForm(false);
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Home':
        return <Home size={18} color={COLORS.primary} />;
      case 'Work':
        return <Briefcase size={18} color={COLORS.primary} />;
      default:
        return <MapPin size={18} color={COLORS.primary} />;
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {showAddForm ? 'Add New Address' : 'Select Delivery Location'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {!showAddForm ? (
            <ScrollView style={styles.content}>
              {addresses.map((addr) => {
                const isSelected = selectedAddress.id === addr.id;
                return (
                  <TouchableOpacity
                    key={addr.id}
                    style={[styles.addressCard, isSelected && styles.selectedCard]}
                    onPress={() => {
                      setSelectedAddress(addr);
                      onClose();
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.iconBox}>{getIcon(addr.title)}</View>
                    <View style={styles.addressInfo}>
                      <Text style={styles.addrTitle}>{addr.title}</Text>
                      <Text style={styles.addrText} numberOfLines={2}>
                        {addr.addressLine1}, {addr.addressLine2 ? `${addr.addressLine2}, ` : ''}
                        {addr.city} - {addr.pincode}
                      </Text>
                    </View>
                    {isSelected && (
                      <View style={styles.checkBadge}>
                        <Check size={14} color={COLORS.white} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddForm(true)}
                activeOpacity={0.8}
              >
                <Plus size={18} color={COLORS.primary} />
                <Text style={styles.addBtnText}>Add New Address</Text>
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <ScrollView style={styles.content}>
              <Text style={styles.label}>Save Address As</Text>
              <View style={styles.tagRow}>
                {(['Home', 'Work', 'Other'] as const).map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.tag, title === tag && styles.activeTag]}
                    onPress={() => setTitle(tag)}
                  >
                    <Text style={[styles.tagText, title === tag && styles.activeTagText]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Address Line 1 (Flat, House No, Building)</Text>
              <TextInput
                style={styles.input}
                value={line1}
                onChangeText={setLine1}
                placeholder="e.g. Flat 402, Block B, Green Valley"
                placeholderTextColor={COLORS.textMuted}
              />

              <Text style={styles.label}>Address Line 2 (Area, Street, Landmark)</Text>
              <TextInput
                style={styles.input}
                value={line2}
                onChangeText={setLine2}
                placeholder="e.g. Sector 62, Near Central Park"
                placeholderTextColor={COLORS.textMuted}
              />

              <View style={styles.rowInputs}>
                <View style={{ flex: 1, marginRight: SPACING.xs }}>
                  <Text style={styles.label}>City</Text>
                  <TextInput
                    style={styles.input}
                    value={city}
                    onChangeText={setCity}
                    placeholder="City"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: SPACING.xs }}>
                  <Text style={styles.label}>Pincode</Text>
                  <TextInput
                    style={styles.input}
                    value={pincode}
                    onChangeText={setPincode}
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <View style={styles.formFooter}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setShowAddForm(false)}
                >
                  <Text style={styles.cancelText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSaveAddress}
                  activeOpacity={0.8}
                >
                  <Text style={styles.saveText}>Save Address</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.xl,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  content: {
    padding: SPACING.lg,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.background,
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  addressInfo: {
    flex: 1,
  },
  addrTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  addrText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  checkBadge: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  addBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  tagRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  tag: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  activeTag: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tagText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  activeTagText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  rowInputs: {
    flexDirection: 'row',
  },
  formFooter: {
    flexDirection: 'row',
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  saveBtn: {
    flex: 2,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
});
