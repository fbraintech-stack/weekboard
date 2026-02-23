# PRD — WeekBoard: Sistema de Tarefas Semanais

| Campo            | Valor                                    |
|------------------|------------------------------------------|
| **Produto**      | WeekBoard                                |
| **Autor**        | Morgan (PM) / Filipe                     |
| **Status**       | Draft                                    |
| **Data**         | 2026-02-23                               |
| **Versão**       | 1.0                                      |

---

## 1. Visão Geral

WeekBoard é uma aplicação web de gestão de tarefas semanais no estilo Kanban, organizada por dias da semana. Combina rotinas de trabalho e afazeres domésticos em uma interface visual simples, com categorias customizáveis e reset automático semanal.

---

## 2. Problema

Filipe precisa organizar sua rotina semanal (trabalho + casa + vida pessoal) de forma visual e prática, sem depender de ferramentas complexas. Precisa ver de relance o que fazer em cada dia da semana e acompanhar o progresso diário.

---

## 3. Solução

Uma aplicação web com layout Kanban híbrido:
- **Colunas** = Dias da semana (Seg a Dom)
- **Cards** = Tarefas com checkbox (pendente/concluída)
- **Categorias** = Cores customizáveis (ex: Trabalho, Casa, Pessoal)
- **Reset automático** = Segunda-feira, tarefas recorrentes voltam; pontuais concluídas somem

---

## 4. Público-Alvo

- Usuário individual que quer organizar sua semana
- Foco em simplicidade e visualização rápida

---

## 5. Funcionalidades

### FR-001: Visualização Semanal (Kanban Híbrido)

- Exibir 7 colunas (Seg, Ter, Qua, Qui, Sex, Sáb, Dom)
- Cabeçalho com número da semana e intervalo de datas
- Destaque visual no dia atual
- Contador de progresso por dia (ex: 2/5 concluídas)
- Barra de progresso geral da semana (ex: 60% concluído)

### FR-002: Gestão de Tarefas

- Criar tarefa com: título, dia(s) da semana, categoria, tipo (recorrente/pontual)
- Marcar/desmarcar tarefa como concluída (checkbox)
- Editar tarefa (título, dia, categoria, tipo)
- Excluir tarefa
- Arrastar tarefa entre dias (drag & drop) — apenas tarefas pontuais

### FR-003: Tipos de Tarefa

| Tipo         | Comportamento no Reset Semanal                              |
|--------------|-------------------------------------------------------------|
| **Recorrente** | Volta como "pendente" toda semana, nos mesmos dias         |
| **Pontual**    | Se concluída → some na próxima semana                      |
| **Pontual**    | Se NÃO concluída → permanece na próxima semana (carry-over)|

### FR-004: Categorias Customizáveis

- Criar categoria com: nome + cor
- Categorias padrão sugeridas: "Trabalho" (azul), "Casa" (verde), "Pessoal" (roxo)
- Filtrar visualização por categoria
- Cada card mostra uma faixa colorida da sua categoria

### FR-005: Reset Semanal Automático

- Na segunda-feira (ou ao acessar pela primeira vez na nova semana):
  - Tarefas recorrentes → resetam para "pendente"
  - Tarefas pontuais concluídas → são removidas
  - Tarefas pontuais não concluídas → permanecem (carry-over)
- Mostrar notificação: "Nova semana! X tarefas pendentes da semana passada foram mantidas."

### FR-006: Autenticação

- Login com email/senha via Supabase Auth
- Cada usuário vê apenas suas próprias tarefas
- Permitir uso sem login (dados no localStorage) com opção de criar conta depois

### FR-007: Design Responsivo

- Desktop: 7 colunas lado a lado
- Tablet: scroll horizontal com colunas
- Mobile: visualização em lista (1 dia por vez, swipe entre dias)

---

## 6. Requisitos Não-Funcionais

| ID      | Requisito                                                    |
|---------|--------------------------------------------------------------|
| NFR-001 | Tempo de carregamento < 2s                                   |
| NFR-002 | Funcionar offline (PWA com service worker)                   |
| NFR-003 | Dados sincronizados em tempo real quando online               |
| NFR-004 | Interface acessível (contraste, teclado, screen reader)       |
| NFR-005 | Suporte a tema escuro (dark mode)                            |

---

## 7. Stack Técnica

| Camada     | Tecnologia                          |
|------------|-------------------------------------|
| Frontend   | Next.js 16 + React 19               |
| Estilo     | Tailwind CSS 4                       |
| Backend    | Supabase (Auth + Database + Realtime)|
| Drag & Drop| @dnd-kit/core                        |
| Deploy     | Vercel                               |
| Estado     | Zustand (local) + TanStack Query (server) |

---

## 8. Modelo de Dados

### Tabela: `categories`

| Coluna     | Tipo      | Descrição              |
|------------|-----------|------------------------|
| id         | uuid (PK) | ID único               |
| user_id    | uuid (FK) | Dono da categoria      |
| name       | text      | Nome (ex: "Trabalho")  |
| color      | text      | Cor hex (ex: "#3B82F6") |
| created_at | timestamp | Data de criação        |

### Tabela: `tasks`

| Coluna      | Tipo        | Descrição                                  |
|-------------|-------------|--------------------------------------------|
| id          | uuid (PK)   | ID único                                   |
| user_id     | uuid (FK)   | Dono da tarefa                             |
| category_id | uuid (FK)   | Categoria                                  |
| title       | text        | Título da tarefa                           |
| type        | enum        | 'recurrent' ou 'oneoff'                    |
| days        | integer[]   | Dias da semana (1=Seg, 7=Dom)              |
| completed   | boolean     | Se está concluída esta semana              |
| week_year   | text        | Semana/ano (ex: "2026-W10")                |
| carry_over  | boolean     | Se foi trazida da semana anterior          |
| created_at  | timestamp   | Data de criação                            |
| updated_at  | timestamp   | Última atualização                         |

---

## 9. Wireframe (Layout Desktop)

```
┌─────────────────────────────────────────────────────────────────┐
│  WeekBoard          Semana 10 • 2-8 Mar 2026       [+ Tarefa]  │
│  ┌─────────┐                                                    │
│  │Filtros: │ [Todas] [Trabalho] [Casa] [Pessoal]  Progresso 40%│
│  └─────────┘ ═══════════════════░░░░░░░░░░░░░░░░               │
├─────────┬─────────┬─────────┬─────────┬─────────┬────────┬─────┤
│   SEG   │   TER   │  QUA*   │   QUI   │   SEX   │  SAB   │ DOM │
│  (2/3)  │  (1/4)  │  (0/2)  │  (0/3)  │  (0/2)  │ (0/1)  │(0/1)│
│         │         │         │         │         │        │     │
│ ✅Emails│ ☐Relat. │ ☐Reunião│ ☐Emails │ ☐Relat. │ ☐Faxin│☐Plan│
│ 🔵Trab  │ 🔵Trab  │ 🔵Trab  │ 🔵Trab  │ 🔵Trab  │ 🟢Casa│🟣Pes│
│         │         │         │         │         │        │     │
│ ✅Lavar │ ☐Cozin. │ ☐Compra │ ☐Lavar  │ ☐Organ. │        │     │
│ 🟢Casa  │ 🟢Casa  │ 🟢Casa  │ 🟢Casa  │ 🟢Casa  │        │     │
│         │         │         │         │         │        │     │
│ ☐Estudo │ ☐Acad.  │         │ ☐Estudo │         │        │     │
│ 🟣Pess. │ ☐Merc.→ │         │ 🟣Pess. │         │        │     │
│         │ ⚡Pont.  │         │         │         │        │     │
└─────────┴─────────┴─────────┴─────────┴─────────┴────────┴─────┘

Legenda:
  ✅ = Concluída     ☐ = Pendente
  → = Carry-over (veio da semana passada)
  ⚡ = Tarefa pontual
  * = Dia atual (destaque)
```

---

## 10. Épicos Sugeridos

| # | Épico                            | Stories Estimadas | Prioridade |
|---|----------------------------------|-------------------|------------|
| 1 | Setup do projeto e infraestrutura | 3-4              | MUST       |
| 2 | Layout Kanban semanal            | 4-5              | MUST       |
| 3 | CRUD de tarefas                  | 3-4              | MUST       |
| 4 | Categorias customizáveis         | 2-3              | MUST       |
| 5 | Reset semanal automático         | 2-3              | MUST       |
| 6 | Autenticação e multi-usuário     | 2-3              | SHOULD     |
| 7 | Drag & Drop                      | 1-2              | SHOULD     |
| 8 | Responsividade mobile            | 2-3              | SHOULD     |
| 9 | PWA e modo offline               | 2-3              | COULD      |
| 10| Dark mode                        | 1-2              | COULD      |

---

## 11. MVP (Versão Mínima)

O MVP inclui os épicos 1 a 5 (prioridade MUST):

1. Projeto configurado (Next.js + Supabase + Tailwind)
2. Visualização semanal com 7 colunas
3. Criar, editar, excluir e completar tarefas
4. Categorias com cores
5. Reset semanal automático com carry-over de pontuais

**Estimativa**: ~15-18 stories para o MVP completo.

---

## 12. Métricas de Sucesso

| Métrica                          | Meta             |
|----------------------------------|------------------|
| Tarefas criadas por semana       | > 10             |
| Taxa de conclusão semanal        | > 60%            |
| Uso contínuo (semanas seguidas)  | > 4 semanas      |
| Tempo para criar uma tarefa      | < 5 segundos     |

---

## 13. Riscos

| Risco                                      | Mitigação                               |
|--------------------------------------------|-----------------------------------------|
| Complexidade de drag & drop no mobile      | Deixar para pós-MVP                     |
| Sincronização offline/online               | Deixar PWA para pós-MVP                 |
| Sobrecarga de features para um iniciante   | Foco no MVP, iterar depois              |

---

## 14. Restrições

- CON-001: Usuário é iniciante — priorizar simplicidade
- CON-002: Projeto individual (1 desenvolvedor + IA)
- CON-003: Budget zero — usar tiers gratuitos (Vercel, Supabase)

---

## Change Log

| Data       | Autor  | Mudança                    |
|------------|--------|----------------------------|
| 2026-02-23 | Morgan | Criação do PRD v1.0        |

---

— Morgan, planejando o futuro
