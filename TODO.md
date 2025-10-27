# ToDo List - Trabalho 1: Processamento de Imagens

## 1. Operações de transformação de intensidade
- [x] Implementar Negativo da imagem 
- [x] Implementar Correção de gama 
- [x] Implementar transformação linear definida por partes

## 2. Esteganografia
- [x] Implementar método de esteganografia para ocultar informação na imagem

## 3. Análise de histograma
- [x] Implementar exibição do histograma da imagem
- [x] Implementar ajuste de contraste por equalização de histograma

## 4. Segmentação
- [x] Implementar limiarização (binarização) da imagem

## 5. Filtragem por convolução
- [x] Implementar função genérica para filtro por convolução
- [x] Permitir que usuário escolha tamanho do filtro (3x3, 5x5, 7x7, 9x9, etc)
- [x] Aplicar bordas pretas para manter tamanho original da imagem após convolução
- [x] Normalizar valores resultantes da convolução para faixa 0-255 para exibição

## 6. Filtros específicos
- [x] Filtro de suavização da média simples
- [x] Filtro de suavização da média ponderada
- [x] Pré-definir filtro Gaussiano 3x3
- [x] Pré-definir filtro Laplaciano 3x3
- [x] Filtragem pela mediana com tamanho de filtro variável

## 7. Realce e detecção de bordas
- [x] Implementar aguçamento (nitidez) por filtro Laplaciano
- [x] Implementar aguçamento por filtro High-Boost
- [x] Implementar filtros de Sobel (gradiente em X)
- [x] Implementar filtros de Sobel (gradiente em Y)
- [x] Implementar detecção não linear de bordas pelo gradiente (magnitude)

## 8. Escala e Rotação com Interpolação Bilinear

- [x] Escala
- [x] Rotação

## 8. Fourier

- [x] (Incompleto) Cálculo da Transformada Discreta de Fourier, exibição do espectro (deslocado) com possibilidade de edição por parte do usuário (ferramenta de desenho que permita riscar com pontos pretos e brancos a imagem do espectro ou pontos em escala de cinza - “pincel suave”) e cálculo da transformada inversa (dadas as modificações editadas pelo usuário no espectro), obtendo a imagem filtrada.

## 9. Imagens Coloridas

- [x] Escala de Cinza Pondereda
- [x] Escala de Cinza Simples
- [x] Negativo
- [ ] Chroma-Key 
- [ ] Histograma R G B e I 
- [ ] Equalização de Histograma (HSI)
- [x] Suavização e Aguçamento 
- [ ] Ajuste de Matiz
- [x] Saturação e Brilho
- [x] Ajuste de Canal
- [ ] Sépia

---

**Observações importantes:**
- A operação de convolução deve ser implementada manualmente (sem usar bibliotecas prontas para convolução).
- O tamanho máximo do filtro deve ser pelo menos 9x9 (pode ser maior).
- A imagem processada deve manter o mesmo tamanho da original, com bordas pretas adicionadas para aplicação da convolução.
- Para filtros que geram valores negativos ou acima de 255, deve-se normalizar os valores para exibição correta.
