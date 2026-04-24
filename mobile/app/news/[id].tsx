import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import RenderHtml from "react-native-render-html";

import { getNewsDetailApi } from "@/services/newsService";
import { News } from "@/types";
import { getImageUrl } from "@/constants/config";
import { formatDateTime } from "@/utils";

const { width } = Dimensions.get("window");

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res: any = await getNewsDetailApi(id!);
        if (res?.status === 200) setNews(res.data);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetch();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );
  }

  if (!news) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-400 text-lg">Không tìm thấy tin tức</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
    >
      {news.thumb && (
        <Image
          source={{ uri: getImageUrl(news.thumb) }}
          style={{ width, height: 220 }}
          contentFit="cover"
        />
      )}

      <View className="px-5 pt-4 pb-8">
        <Text className="text-2xl font-bold text-gray-900 leading-8">
          {news.title}
        </Text>

        {news.createdAt && (
          <Text className="text-gray-400 text-sm mt-2">
            {formatDateTime(news.createdAt)}
          </Text>
        )}

        {news.tags && news.tags.length > 0 && (
          <View className="flex-row flex-wrap mt-3">
            {news.tags.map((tag) => (
              <View
                key={tag}
                className="bg-blue-50 px-2.5 py-1 rounded-full mr-2 mb-2"
              >
                <Text className="text-blue-600 text-xs font-medium">{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <View className="mt-4">
          {news.content ? (
            <RenderHtml
              contentWidth={width - 40}
              source={{ html: news.content }}
              baseStyle={{ color: "#374151", fontSize: 15, lineHeight: 26 }}
            />
          ) : (
            <Text className="text-gray-500">Không có nội dung</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
