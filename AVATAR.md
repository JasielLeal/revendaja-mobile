# 👤 Componente Avatar

O componente Avatar gera automaticamente as iniciais de um nome e cria um avatar colorido e consistente.

## 🚀 Funcionalidades

- **Geração automática de iniciais**: Extrai primeira letra do primeiro e último nome
- **Cores consistentes**: Mesma cor para o mesmo nome sempre
- **Múltiplos tamanhos**: sm, md, lg, xl
- **Customizável**: Cores, estilos e tamanhos personalizados
- **Otimizado para React Native**: Sem dependências externas

## 📚 Como Usar

### Uso Básico

```tsx
import { Avatar } from "@/components/ui/avatar";

// Uso simples
<Avatar name="Jasiel Viana Leal" />;
// Resultado: "JL" (primeira do primeiro + primeira do último)
```

### Diferentes Tamanhos

```tsx
<Avatar name="Maria Silva" size="sm" />   // 32x32
<Avatar name="João Santos" size="md" />   // 40x40 (padrão)
<Avatar name="Ana Costa" size="lg" />     // 48x48
<Avatar name="Pedro Oliveira" size="xl" /> // 64x64
```

### Cores Personalizadas

```tsx
<Avatar name="Carlos Ferreira" backgroundColor="#3B82F6" textColor="#FFFFFF" />
```

### Com Estilos Customizados

```tsx
<Avatar
  name="Fernanda Lima"
  style={{ borderWidth: 2, borderColor: "#E5E7EB" }}
  textStyle={{ fontWeight: "700" }}
/>
```

## 🎨 Exemplos de Nomes

| Nome Completo              | Iniciais | Cor Gerada  |
| -------------------------- | -------- | ----------- |
| "Jasiel Viana Leal"        | JL       | 🔵 Azul     |
| "Maria Silva"              | MS       | 🟢 Verde    |
| "João"                     | J        | 🟡 Amarelo  |
| "Ana Beatriz Costa Santos" | AS       | 🟣 Roxo     |
| "Pedro"                    | P        | 🔴 Vermelho |

## 🔧 Props

```tsx
interface AvatarProps {
  name: string; // Nome completo (obrigatório)
  size?: "sm" | "md" | "lg" | "xl"; // Tamanho predefinido
  backgroundColor?: string; // Cor de fundo customizada
  textColor?: string; // Cor do texto customizada
  style?: ViewStyle; // Estilo customizado do container
  textStyle?: TextStyle; // Estilo customizado do texto
  className?: string; // Classes CSS adicionais
}
```

## 💡 Algoritmo de Cores

O componente usa um algoritmo de hash determinístico para garantir que:

- Mesmo nome = sempre a mesma cor
- Distribuição uniforme entre 10 cores predefinidas
- Cores acessíveis com bom contraste

## 🎯 Casos de Uso

### 1. Lista de Usuários

```tsx
{
  users.map((user) => (
    <View key={user.id} className="flex-row items-center p-3">
      <Avatar name={user.fullName} size="md" />
      <Text className="ml-3">{user.fullName}</Text>
    </View>
  ));
}
```

### 2. Header da Aplicação

```tsx
<View className="flex-row items-center">
  <Avatar name="Jasiel Viana Leal" size="md" />
  <Text className="ml-3 font-bold">Olá, Jasiel</Text>
</View>
```

### 3. Lista de Vendas/Transações

```tsx
<Avatar name={sale.customerName} size="sm" style={{ marginRight: 12 }} />
```

## 🌟 Vantagens

- ✅ **Performance**: Não precisa carregar imagens
- ✅ **Consistência**: Mesma aparência sempre
- ✅ **Acessibilidade**: Cores com bom contraste
- ✅ **Flexibilidade**: Múltiplas opções de customização
- ✅ **Simplicidade**: Só precisa passar o nome
