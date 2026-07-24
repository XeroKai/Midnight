import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { MultiplayerStore } from '../store/multiplayerStore';

interface RoomListScreenProps {
  onSelectMode: (mode: 'create' | 'join') => void;
}

const RoomListScreen: React.FC<RoomListScreenProps> = ({ onSelectMode }) => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playerName, setPlayerName] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [joinModalVisible, setJoinModalVisible] = useState(false);

  const listRooms = MultiplayerStore((state) => state.listRooms);
  const joinRoom = MultiplayerStore((state) => state.joinRoom);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setLoading(true);
    try {
      const availableRooms = await listRooms();
      setRooms(availableRooms);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!playerName.trim() || !selectedRoom) {
      alert('Lütfen adınızı girin');
      return;
    }

    const success = await joinRoom(selectedRoom.id, playerName);
    if (success) {
      setJoinModalVisible(false);
      // Navigate to multiplayer game
      console.log('✅ Oyuna katıldınız!');
    } else {
      alert('Odaya katılma başarısız!');
    }
  };

  const renderRoom = ({ item }: { item: any }) => {
    const playerCount = Object.keys(item.players || {}).length;
    const isFull = playerCount >= item.maxPlayers;

    return (
      <TouchableOpacity
        style={[styles.roomCard, isFull && styles.roomCardFull]}
        onPress={() => {
          if (!isFull) {
            setSelectedRoom(item);
            setJoinModalVisible(true);
          }
        }}
        disabled={isFull}
      >
        <View style={styles.roomHeader}>
          <Text style={styles.roomName}>{item.name}</Text>
          <Text style={[styles.roomStatus, isFull && styles.statusFull]}>
            {isFull ? '🔴 DOLU' : '🟢 AÇIK'}
          </Text>
        </View>

        <View style={styles.roomInfo}>
          <Text style={styles.infoText}>
            👥 Oyuncular: {playerCount}/{item.maxPlayers}
          </Text>
          <Text style={styles.infoText}>
            🏠 Host: {item.players[item.host]?.name || 'Bilinmiyor'}
          </Text>
          <Text style={styles.infoText}>
            ⏱️ Oluşturuldu: {new Date(item.createdAt).toLocaleTimeString('tr-TR')}
          </Text>
        </View>

        <View style={styles.playersList}>
          <Text style={styles.playersLabel}>Oyuncular:</Text>
          {Object.values(item.players || {})
            .slice(0, 3)
            .map((player: any) => (
              <View key={player.id} style={styles.playerBadge}>
                <Text style={styles.playerName}>{player.name}</Text>
              </View>
            ))}
          {playerCount > 3 && (
            <Text style={styles.moreCount}>+{playerCount - 3} daha</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌐 ÇOKLU OYUNCU</Text>
        <Text style={styles.subtitle}>Arkadaşlarınla beraber oyna!</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.createButton]}
          onPress={() => onSelectMode('create')}
        >
          <Text style={styles.buttonIcon}>➕</Text>
          <Text style={styles.buttonText}>YENİ ODA OLUŞTUR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.refreshButton]}
          onPress={loadRooms}
        >
          <Text style={styles.buttonIcon}>🔄</Text>
          <Text style={styles.buttonText}>ODALARI YENILE</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00d4ff" />
          <Text style={styles.loadingText}>Odalar yükleniyor...</Text>
        </View>
      ) : rooms.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🏜️</Text>
          <Text style={styles.emptyText}>Kullanılabilir oda yok!</Text>
          <Text style={styles.emptySubtext}>Yeni bir oda oluşturup başla</Text>
        </View>
      ) : (
        <FlatList
          data={rooms}
          renderItem={renderRoom}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Join Room Modal */}
      <Modal
        visible={joinModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setJoinModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎮 Odaya Katıl</Text>

            <View style={styles.roomPreview}>
              <Text style={styles.previewLabel}>Oda Adı:</Text>
              <Text style={styles.previewValue}>{selectedRoom?.name}</Text>

              <Text style={styles.previewLabel}>Oyuncu Sayısı:</Text>
              <Text style={styles.previewValue}>
                {Object.keys(selectedRoom?.players || {}).length}/
                {selectedRoom?.maxPlayers}
              </Text>
            </View>

            <Text style={styles.inputLabel}>Adını Gir:</Text>
            <TextInput
              style={styles.input}
              placeholder="Oyuncu adınız..."
              placeholderTextColor="#666"
              value={playerName}
              onChangeText={setPlayerName}
              maxLength={20}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setJoinModalVisible(false);
                  setPlayerName('');
                }}
              >
                <Text style={styles.modalButtonText}>❌ İPTAL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.joinButton]}
                onPress={handleJoinRoom}
              >
                <Text style={styles.modalButtonText}>✅ KATIL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00d4ff',
    textShadowColor: '#00d4ff',
    textShadowRadius: 10,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#888',
    letterSpacing: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#1a1f3a',
    borderColor: '#00d4ff',
  },
  refreshButton: {
    backgroundColor: '#1a1f3a',
    borderColor: '#ffa500',
  },
  buttonIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#888',
    marginTop: 12,
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#888',
  },
  listContent: {
    paddingBottom: 12,
    gap: 10,
  },
  roomCard: {
    backgroundColor: '#1a1f3a',
    borderWidth: 1.5,
    borderColor: '#00d4ff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 4,
  },
  roomCardFull: {
    opacity: 0.5,
    borderColor: '#666',
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roomName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00d4ff',
    flex: 1,
  },
  roomStatus: {
    fontSize: 11,
    color: '#00d4ff',
    fontWeight: 'bold',
  },
  statusFull: {
    color: '#ff6b9d',
  },
  roomInfo: {
    backgroundColor: '#0f1329',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    gap: 4,
  },
  infoText: {
    fontSize: 11,
    color: '#aaa',
  },
  playersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  playersLabel: {
    fontSize: 10,
    color: '#ffa500',
    fontWeight: 'bold',
  },
  playerBadge: {
    backgroundColor: '#00d4ff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  playerName: {
    fontSize: 9,
    color: '#0a0e27',
    fontWeight: 'bold',
  },
  moreCount: {
    fontSize: 9,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1f3a',
    borderWidth: 2,
    borderColor: '#00d4ff',
    borderRadius: 16,
    padding: 20,
    width: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 16,
    textAlign: 'center',
  },
  roomPreview: {
    backgroundColor: '#0f1329',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  previewLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
  },
  previewValue: {
    fontSize: 13,
    color: '#00d4ff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 11,
    color: '#ffa500',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0f1329',
    borderWidth: 1.5,
    borderColor: '#00d4ff',
    borderRadius: 8,
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 13,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#1a1f3a',
    borderColor: '#ff6b9d',
  },
  joinButton: {
    backgroundColor: '#1a1f3a',
    borderColor: '#00d4ff',
  },
  modalButtonText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#fff',
  },
});

export default RoomListScreen;
