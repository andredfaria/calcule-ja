# ROADMAP — Novas Funcionalidades

## Visão do Produto
Transformar o Calcule Já em uma plataforma completa de decisões cotidianas, cobrindo finanças, saúde, transporte, casa, estudo e produtividade em uma experiência única, rápida e confiável.

## Critérios de Prioridade
- 🔴 Alta: alto uso diário, baixa complexidade
- 🟡 Média: uso frequente, complexidade moderada
- 🟢 Baixa: nicho específico, alta complexidade

---

## 💰 Finanças Pessoais

1. **Parcelamento com entrada** — Simula entrada + parcelas + CET estimado. Fórmula: sistema PRICE com valor financiado líquido. **🔴 | Média**. Valor: evita contratação ruim.
2. **Simulador de aposentadoria** — Projeta patrimônio por aportes mensais. Fórmula: valor futuro de série + juros compostos. **🔴 | Média**. Valor: planejamento de longo prazo.
3. **Desconto e cashback real** — Calcula economia líquida por campanha. Fórmula: preço final = preço − desconto − cashback. **🔴 | Baixa**. Valor: compra mais inteligente.
4. **Financiamento carro/imóvel** — Estima custo total com taxas e seguros. Fórmula: anuidade + custos fixos anuais. **🟡 | Alta**. Valor: visão de custo real.
5. **Salário líquido CLT x PJ** — Simula impostos e benefícios. Fórmula: líquido = bruto − encargos + benefícios. **🔴 | Alta**. Valor: decisão de carreira.
6. **Meta de economia mensal** — Quanto guardar para objetivo em prazo definido. Fórmula: aporte = alvo / fator de acumulação. **🔴 | Baixa**. Valor: metas viáveis.

## 🏋️ Saúde e Bem-estar

7. **TMB (Harris/Mifflin)** — Taxa metabólica basal com seleção de método. Fórmulas oficiais TMB. **🔴 | Baixa**. Valor: base para dieta.
8. **Macros diários** — Distribui proteína, carbo e gordura por meta calórica. Fórmula: kcal por macro / 4/9. **🔴 | Média**. Valor: organização alimentar.
9. **Hidratação diária** — Litros recomendados por peso e clima/atividade. Fórmula: ml/kg com multiplicadores. **🟡 | Baixa**. Valor: hábito saudável.
10. **Calorias por exercício** — Estima gasto por MET e duração. Fórmula: kcal = MET × peso × tempo(h). **🟡 | Média**. Valor: monitoramento simples.
11. **Peso ideal por biotipo** — Faixa sugerida por altura e biotipo. Fórmula: intervalos de IMC com ajuste. **🟢 | Média**. Valor: referência inicial.
12. **Ciclos de sono** — Horários para dormir/acordar por ciclos de 90 min. Fórmula: hora alvo ± n×90min. **🔴 | Baixa**. Valor: rotina prática.

## 🚗 Transporte e Mobilidade

13. **Custo mensal do carro** — Soma IPVA, seguro, manutenção e combustível. Fórmula: custos fixos + variáveis. **🔴 | Média**. Valor: custo total de propriedade.
14. **Uber vs carro próprio** — Compara custo mensal entre alternativas. Fórmula: custo_uber − custo_carro. **🟡 | Média**. Valor: escolha econômica.
15. **Pedágio por viagem** — Estima total de pedágios no trajeto. Fórmula: soma de praças. **🟡 | Média**. Valor: previsão de caixa.
16. **Tempo de viagem com paradas** — Adiciona pausas por distância. Fórmula: tempo = d/v + n_paradas×tempo_parada. **🔴 | Baixa**. Valor: planejamento realista.

## 🏗️ Construção e Reforma

17. **Quantidade de tinta** — Litros por m² com demãos. Fórmula: litros = área×demãos/rendimento. **🔴 | Baixa**. Valor: compra sem desperdício.
18. **Pisos/cerâmicas por área** — Quantidade + margem de perda. Fórmula: peças = área/área_peça × (1+perda). **🔴 | Baixa**. Valor: orçamento preciso.
19. **Material para concreto** — Traço por volume final. Fórmula: proporcionalidade de traço (cimento/areia/brita). **🟡 | Alta**. Valor: obra mais previsível.
20. **Mão de obra por cômodo** — Estimativa com custo por m². Fórmula: custo = área×valor_m2. **🟡 | Baixa**. Valor: controle de orçamento.

## 📐 Matemática e Conversão

21. **Conversor de unidades** — Massa, volume, comprimento e temperatura. Fórmulas de conversão padrão. **🔴 | Média**. Valor: uso transversal.
22. **Porcentagem avançada** — aumento, desconto, variação e reversão. Fórmulas de taxa relativa. **🔴 | Baixa**. Valor: finanças e compras.
23. **Médias (simples/ponderada/geométrica)** — cálculo acadêmico e analítico. Fórmulas clássicas de média. **🔴 | Baixa**. Valor: estudo/trabalho.
24. **PA e PG** — termo geral e soma de termos. Fórmulas `an` e `Sn`. **🟡 | Média**. Valor: educação e concursos.
25. **Pitágoras e áreas geométricas** — triângulos, círculos e polígonos básicos. Fórmulas de geometria plana. **🟡 | Média**. Valor: uso escolar/técnico.

## 📅 Tempo e Produtividade

26. **Horas trabalhadas** — total por dia/semana/mês. Fórmula: soma de intervalos. **🔴 | Baixa**. Valor: controle de jornada.
27. **Diferença entre datas** — dias, meses e anos entre dois marcos. Fórmula: diff temporal normalizado. **🔴 | Baixa**. Valor: organização pessoal.
28. **Contador regressivo** — dias/horas até meta ou evento. Fórmula: alvo − agora. **🟡 | Baixa**. Valor: foco em metas.
29. **Hora extra** — cálculo com adicional legal. Fórmula: hora_base × (1+adicional). **🔴 | Média**. Valor: conferência trabalhista.

## 🍔 Alimentação

30. **Custo por porção de receita** — divide custo total por rendimento. Fórmula: custo/porções. **🔴 | Baixa**. Valor: gestão doméstica.
31. **Conversão culinária** — xícara/colher/ml/g por ingrediente. Fórmula: tabelas de equivalência. **🟡 | Média**. Valor: praticidade na cozinha.
32. **Estimativa de alcoolemia** — cálculo aproximado por consumo e peso. Fórmula: Widmark simplificada. **🟢 | Alta**. Valor: conscientização e segurança.

---

## Sequência recomendada de execução
1. **Sprint 1 (Alta/Baixa):** 1, 3, 6, 12, 16, 17, 18, 22, 23, 26, 27, 30.
2. **Sprint 2 (Alta/Média):** 2, 13, 29, 21, 24, 25.
3. **Sprint 3 (Média/Alta e nicho):** 4, 5, 10, 15, 19, 31, 32.
