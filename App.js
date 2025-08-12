import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, FlatList } from 'react-native';

export default function App() {
  const [autor, setAutor] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [muralOficial, setMuralOficial] = useState([]); // Lista da API

  const apiUrl = 'https://api-mural.onrender.com/recados';

  // Função para buscar os recados publicados na API
  const carregarMuralOficial = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Falha ao buscar recados do mural.');
      const dados = await response.json();
      setMuralOficial(dados);
    } catch (error) {
      console.error('Erro ao carregar mural oficial:', error);
      Alert.alert("Erro", "Não foi possível carregar o mural oficial.");
    }
  };

  useEffect(() => {
    carregarMuralOficial();
  }, []);

  // Função para enviar recado
  const handleEnviarRecado = async () => {
    if (autor.trim() === '' || mensagem.trim() === '') {
      Alert.alert("Atenção", "Por favor, preencha seu nome e a mensagem.");
      return;
    }

    setCarregando(true);

    try {
      const novoRecado = { autor, mensagem };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoRecado),
      });

      if (!response.ok) throw new Error('Falha ao enviar o recado para a API.');

      Alert.alert("Sucesso!", "Seu recado foi publicado no mural.");
      setAutor('');
      setMensagem('');

      // Atualiza mural oficial depois do envio
      carregarMuralOficial();
    } catch (error) {
      console.error("Erro ao enviar recado:", error);
      Alert.alert("Erro", "Não foi possível enviar seu recado. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Seu Nome:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={autor}
        onChangeText={setAutor}
      />

      <Text style={styles.label}>Sua Mensagem:</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Escreva seu recado aqui..."
        value={mensagem}
        onChangeText={setMensagem}
        multiline
      />

      <Button
        title={carregando ? "Enviando..." : "Publicar Recado"}
        onPress={handleEnviarRecado}
        disabled={carregando}
      />

      <Text style={styles.tituloMural}>Mural de Recados</Text>
      {muralOficial.length === 0 ? (
        <Text style={{ color: '#666' }}>Nenhum recado publicado ainda.</Text>
      ) : (
        <FlatList
          data={muralOficial}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.autor}>{item.autor}</Text>
              <Text style={styles.msg}>{item.mensagem}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b9e4ff', // azul claro Wii
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: '#044b7f',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(200,200,200,0.4)',
    padding: 12,
    marginTop: 5,
    borderRadius: 12,
    fontSize: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  tituloMural: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    color: '#044b7f',
    textShadowColor: 'rgba(106,198,255,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(200,200,200,0.3)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  autor: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1e90ff',
    marginBottom: 4,
  },
  msg: {
    fontSize: 14,
    color: '#333',
  },
});
