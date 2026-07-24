import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { GameStore } from '../store/gameStore';
import { GameEngine } from '../engine/gameEngine';

const { width, height } = Dimensions.get('window');

const GameWorld: React.FC = () => {
  const player = GameStore((state) => state.player);
  const businesses = GameStore((state) => state.businesses);
  const [fps, setFps] = useState(60);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const fpsInterval = setInterval(() => {
      setFps(Math.floor(Math.random() * 20) + 50);
    }, 1000);

    const timeInterval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(fpsInterval);
      clearInterval(timeInterval);
    };
  }, []);

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      GameEngine.autoSave();
    }, 30000); // Her 30 saniyede bir

    return () => clearInterval(autoSaveInterval);
  }, []);

  if (!player) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>❌ Oyuncu verisi yüklenemedi</Text>
      </View>
    );
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Header - Player Stats */}
      <View style={styles.header}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>💰 Para</Text>
          <Text style={styles.statValue}>${player.money.toFixed(0)}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>⭐ İtibar</Text>
          <Text style={styles.statValue}>{player.reputation}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>📊 Seviye</Text>
          <Text style={styles.statValue}>{player.level}</Text>
        </View>
      </View>

      {/* World Map View */}
      <View style={styles.worldView}>
        <View style={styles.mapHeader}>
          <Text style={styles.mapTitle}>🌆 ŞEHİR HARITASI</Text>
          <Text style={styles.mapCoords}>
            ({player.position.x.toFixed(0)}, {player.position.y.toFixed(0)})
          </Text>
        </View>
        <View style={styles.mapContainer}>
          <View style={styles.playerMarker}>
            <Text style={styles.playerIcon}>🏢</Text>
          </View>
          <Text style={styles.mapHint}>Etrafında {{businesses.length}} işletme</Text>
        </View>
      </View>

      {/* Quick Stats Panel */}
      <View style={styles.statsPanel}>
        <View style={styles.statRow}>
          <Text style={styles.statRowLabel}>📦 Malı:</Text>
          <Text style={styles.statRowValue}>{player.inventory.goods || 0}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statRowLabel}>🏭 İşletmeler:</Text>
          <Text style={styles.statRowValue}>{businesses.length}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statRowLabel}>⏱️ Zaman:</Text>
          <Text style={styles.statRowValue}>{formatTime(elapsedTime)}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionPanel}>
        <Text style={styles.panelTitle}>🎯 HIZLI İŞLEMLER</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>🏭</Text>
            <Text style={styles.actionLabel}>Üretim</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📦</Text>
            <Text style={styles.actionLabel}>Dağıtım</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>💼</Text>
            <Text style={styles.actionLabel}>Satış</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionLabel}>NPC'ler</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>💡</Text>
            <Text style={styles.actionLabel}>Yükselt</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Performance Indicator */}
      <View style={styles.footer}>
        <View style={styles.perfIndicator}>
          <Text style={styles.perfText}>FPS: {fps}</Text>
        </View>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>💾 KAYDET</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1a1f3a',
    borderWidth: 1.5,
    borderColor: '#00d4ff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  statLabel: {
    color: '#888',
    fontSize: 11,
    marginBottom: 4,
    fontWeight: '600',
  },
  statValue: {
    color: '#00d4ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  worldView: {
    flex: 1.2,
    backgroundColor: '#1a1f3a',
    borderWidth: 1.5,
    borderColor: '#ff6b9d',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mapTitle: {
    color: '#ff6b9d',
    fontSize: 13,
    fontWeight: 'bold',
  },
  mapCoords: {
    color: '#ff6b9d',
    fontSize: 11,
    opacity: 0.7,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#0f1329',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    position: 'relative',
  },
  playerMarker: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00d4ff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  playerIcon: {
    fontSize: 24,
  },
  mapHint: {
    color: '#666',
    fontSize: 12,
    marginTop: 10,
  },
  statsPanel: {
    backgroundColor: '#1a1f3a',
    borderWidth: 1,
    borderColor: '#ffa500',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  statRowLabel: {
    color: '#ffa500',
    fontSize: 12,
    fontWeight: '600',
  },
  statRowValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionPanel: {
    marginBottom: 10,
  },
  panelTitle: {
    color: '#00d4ff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  actionButton: {
    backgroundColor: '#1a1f3a',
    borderWidth: 1.5,
    borderColor: '#00d4ff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 70,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionLabel: {
    color: '#00d4ff',
    fontSize: 10,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  perfIndicator: {
    flex: 1,
    backgroundColor: '#1a1f3a',
    borderWidth: 1.5,
    borderColor: '#ffa500',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  perfText: {
    color: '#ffa500',
    fontSize: 12,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#1a1f3a',
    borderWidth: 1.5,
    borderColor: '#00d4ff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  saveButtonText: {
    color: '#00d4ff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff6b9d',
    fontSize: 14,
  },
});

export default GameWorld;
