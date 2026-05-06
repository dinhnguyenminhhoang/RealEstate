import React, { useState, useEffect } from "react";
import { View, Text, Modal, Pressable, FlatList, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface LocationPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (province: string, district: string, ward: string) => void;
}

export default function LocationPickerModal({ visible, onClose, onSelect }: LocationPickerProps) {
  const [step, setStep] = useState<"PROVINCE" | "DISTRICT" | "WARD">("PROVINCE");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);

  useEffect(() => {
    if (visible && provinces.length === 0) {
      fetchProvinces();
    }
  }, [visible]);

  const fetchProvinces = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://provinces.open-api.vn/api/?depth=3");
      const json = await res.json();
      setProvinces(json);
      setData(json);
      setStep("PROVINCE");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item: any) => {
    if (step === "PROVINCE") {
      setSelectedProvince(item);
      setDistricts(item.districts || []);
      setData(item.districts || []);
      setStep("DISTRICT");
    } else if (step === "DISTRICT") {
      setSelectedDistrict(item);
      setWards(item.wards || []);
      setData(item.wards || []);
      setStep("WARD");
    } else if (step === "WARD") {
      onSelect(selectedProvince.name, selectedDistrict.name, item.name);
      reset();
      onClose();
    }
  };

  const goBack = () => {
    if (step === "WARD") {
      setStep("DISTRICT");
      setData(districts);
    } else if (step === "DISTRICT") {
      setStep("PROVINCE");
      setData(provinces);
    } else {
      onClose();
    }
  };

  const reset = () => {
    setStep("PROVINCE");
    setData(provinces);
    setSelectedProvince(null);
    setSelectedDistrict(null);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View className="flex-1 bg-white pt-12">
        <View className="flex-row items-center px-4 pb-4 border-b border-gray-100">
          <Pressable onPress={goBack} className="p-2 mr-2">
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </Pressable>
          <Text className="text-xl font-bold text-gray-900">
            {step === "PROVINCE" ? "Chọn Tỉnh/Thành phố" : step === "DISTRICT" ? "Chọn Quận/Huyện" : "Chọn Phường/Xã"}
          </Text>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#DC2626" />
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.code.toString()}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelect(item)}
                className="px-6 py-4 border-b border-gray-50 flex-row justify-between items-center"
              >
                <Text className="text-gray-800 text-base">{item.name}</Text>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              </Pressable>
            )}
          />
        )}
      </View>
    </Modal>
  );
}
