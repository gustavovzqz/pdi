# ToDo List - Trabalho 1: Processamento de Imagens

## 1. Operações de transformação de intensidade
- [ ] Implementar Negativo da imagem
- [ ] Implementar Correção de gama
- [ ] Implementar transformação linear definida por partes

## 2. Esteganografia
- [ ] Implementar método de esteganografia para ocultar informação na imagem

## 3. Análise de histograma
- [ ] Implementar exibição do histograma da imagem
- [ ] Implementar ajuste de contraste por equalização de histograma

## 4. Segmentação
- [ ] Implementar limiarização (binarização) da imagem

## 5. Filtragem por convolução
- [ ] Implementar função genérica para filtro por convolução
- [ ] Permitir que usuário escolha tamanho do filtro (3x3, 5x5, 7x7, 9x9, etc)
- [ ] Aplicar bordas pretas para manter tamanho original da imagem após convolução
- [ ] Normalizar valores resultantes da convolução para faixa 0-255 para exibição

## 6. Filtros específicos
- [ ] Filtro de suavização da média simples
- [ ] Filtro de suavização da média ponderada
- [ ] Pré-definir filtro Gaussiano 3x3
- [ ] Pré-definir filtro Laplaciano 3x3
- [ ] Filtragem pela mediana com tamanho de filtro variável

## 7. Realce e detecção de bordas
- [ ] Implementar aguçamento (nitidez) por filtro Laplaciano
- [ ] Implementar aguçamento por filtro High-Boost
- [ ] Implementar filtros de Sobel (gradiente em X)
- [ ] Implementar filtros de Sobel (gradiente em Y)
- [ ] Implementar detecção não linear de bordas pelo gradiente (magnitude)

---

**Observações importantes:**
- A operação de convolução deve ser implementada manualmente (sem usar bibliotecas prontas para convolução).
- O tamanho máximo do filtro deve ser pelo menos 9x9 (pode ser maior).
- A imagem processada deve manter o mesmo tamanho da original, com bordas pretas adicionadas para aplicação da convolução.
- Para filtros que geram valores negativos ou acima de 255, deve-se normalizar os valores para exibição correta.
