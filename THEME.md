# 🎨 Tema Personalizado - Leal Perfumaria Mobile

Este projeto agora inclui um sistema de tema personalizado baseado nas mesmas variáveis CSS que você usa na web, garantindo consistência visual entre as plataformas.

## 📁 Estrutura do Tema

### Arquivos Principais

- **`app/globals.css`** - Variáveis CSS do tema (light/dark)
- **`tailwind.config.js`** - Configuração do Tailwind com cores customizadas
- **`lib/utils.ts`** - Utilitários para trabalhar com o tema
- **`components/ui/`** - Componentes que seguem o design system

## 🎯 Cores Disponíveis

### Cores Principais

```css
--background: Background principal da aplicação --foreground: Cor principal do
  texto --card: Background de cartões/cards --card-foreground: Texto em cards
  --primary: Cor primária da marca --primary-foreground: Texto sobre cor
  primária --secondary: Cor secundária --secondary-foreground: Texto sobre cor
  secundária --muted: Cor neutra/suave --muted-foreground: Texto suave
  --accent: Cor de destaque --accent-foreground: Texto sobre destaque
  --destructive: Cor para ações destrutivas --border: Cor das bordas
  --input: Background de inputs --ring: Cor do foco/ring;
```

### Cores da Sidebar

```css
--sidebar: Background da sidebar --sidebar-foreground: Texto da sidebar
  --sidebar-primary: Cor primária da sidebar --sidebar-accent: Cor de destaque
  da sidebar --sidebar-border: Bordas da sidebar;
```

### Cores de Gráficos

```css
--chart-1 a --chart-5: Cores para gráficos
```

## 🛠️ Como Usar

### 1. Classes CSS Diretas

```tsx
<View className="bg-background">
  <Text className="text-foreground">Texto principal</Text>
  <View className="bg-card border border-border rounded-lg">
    <Text className="text-card-foreground">Card content</Text>
  </View>
</View>
```

### 2. Componentes Pré-construídos

```tsx
import { Card } from '@/components/ui/card';
import { ThemedButton } from '@/components/ui/themed-button';

// Usando Card
<Card>
  <Card.Header>
    <Card.Title>Título do Card</Card.Title>
    <Card.Description>Descrição opcional</Card.Description>
  </Card.Header>
  <Card.Content>
    <Text className="text-card-foreground">Conteúdo do card</Text>
  </Card.Content>
</Card>

// Usando Button
<ThemedButton
  title="Salvar"
  variant="primary"
  size="md"
  onPress={handleSave}
/>
```

### 3. Utilitários

```tsx
import { cn, getThemeColors } from "@/lib/utils";

// Combinando classes
const buttonClass = cn(
  "px-4 py-2 rounded",
  variant === "primary" ? "bg-primary" : "bg-secondary",
  className
);

// Acessando cores programaticamente
const colors = getThemeColors();
 // 'var(--primary)'
```

## 🌙 Modo Escuro

O tema automaticamente suporta modo escuro através das variáveis CSS. O React Native detecta a preferência do sistema e aplica as cores apropriadas.

### Testando o Modo Escuro

1. **iOS**: Configurações > Tela e Brilho > Escuro
2. **Android**: Configurações > Tela > Tema escuro
3. **Web**: Preferências do navegador ou DevTools

## 📱 Exemplo Prático

O arquivo `app/(tabs)/index.tsx` foi atualizado para usar o novo tema:

```tsx
// Antes (cores hardcoded)
<Text className="text-gray-800">Texto</Text>
<View className="bg-slate-900">Content</View>

// Depois (usando variáveis do tema)
<Text className="text-foreground">Texto</Text>
<View className="bg-background">Content</View>
```

## 🎨 Customização

Para modificar as cores do tema, edite o arquivo `app/globals.css`:

```css
:root {
  --primary: oklch(0.646 0.222 41.116); /* Nova cor primária */
  --background: oklch(1 0 0); /* Novo background */
}

.dark {
  --primary: oklch(0.705 0.213 47.604); /* Primária no escuro */
  --background: oklch(0.141 0.005 285.823); /* Background no escuro */
}
```

## 🔄 Migração

Para migrar componentes existentes:

1. Substitua cores hardcoded pelas variáveis do tema
2. Use `text-foreground` no lugar de `text-gray-800` ou `text-white`
3. Use `bg-background` no lugar de `bg-white` ou `bg-black`
4. Use `bg-card` para backgrounds de cards
5. Use `border-border` para bordas
6. Use `text-muted-foreground` para texto secundário

## 📚 Componentes Disponíveis

- **Card**: Card responsivo com header, título e conteúdo
- **ThemedButton**: Botão com variantes primary, secondary e destructive
- **Utils**: Utilitários para trabalhar com classes CSS

## 🚀 Próximos Passos

1. Criar mais componentes UI (Input, Select, Modal, etc.)
2. Implementar animações que respeitam o tema
3. Adicionar suporte a temas personalizados por usuário
4. Integrar com sistema de preferências do app
