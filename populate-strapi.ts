/**
 * Script para popular o Strapi com dados iniciais usando Playwright
 *
 * Execução:
 * npm install -D @playwright/test
 * npx ts-node populate-strapi.ts
 */

import { chromium, Browser, Page } from '@playwright/test';

const STRAPI_URL = 'http://localhost:1337';
const EMAIL = 'joeljunior.dev@gmail.com';
const PASSWORD = 'Teste@123';

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function login(page: Page) {
  console.log('📝 Fazendo login no Strapi...');
  await page.goto(`${STRAPI_URL}/admin`);
  await page.waitForLoadState('networkidle');

  // Preencher email e senha
  await page.fill('input[name="email"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);

  // Clicar no botão de login
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
  await delay(2000);

  console.log('✅ Login realizado com sucesso!');
}

async function createCategory(page: Page, data: {
  nome: string;
  slug: string;
  descricao: string;
  ordem: number;
}) {
  console.log(`📁 Criando categoria: ${data.nome}...`);

  // Navegar para Content Manager > Category
  await page.goto(`${STRAPI_URL}/admin/content-manager/collection-types/api::category.category`);
  await page.waitForLoadState('networkidle');
  await delay(1000);

  // Clicar em "Create new entry"
  await page.click('text=Create new entry');
  await page.waitForLoadState('networkidle');
  await delay(1000);

  // Preencher campos
  await page.fill('input[name="nome"]', data.nome);
  await delay(500);

  // O slug é gerado automaticamente, mas vamos garantir
  const slugInput = await page.$('input[name="slug"]');
  if (slugInput) {
    await slugInput.fill(data.slug);
  }

  await page.fill('textarea[name="descricao"]', data.descricao);
  await page.fill('input[name="ordem"]', data.ordem.toString());

  // Marcar como ativa
  const ativaCheckbox = await page.$('input[name="ativa"]');
  if (ativaCheckbox) {
    const isChecked = await ativaCheckbox.isChecked();
    if (!isChecked) {
      await ativaCheckbox.check();
    }
  }

  // Upload de imagem (placeholder - você precisará ter imagens)
  console.log('⚠️  Atenção: Upload de imagem precisa ser feito manualmente');

  await delay(1000);

  // Salvar
  await page.click('button:has-text("Save")');
  await delay(2000);

  // Publicar
  try {
    await page.click('button:has-text("Publish")');
    await delay(2000);
    console.log(`✅ Categoria ${data.nome} criada e publicada!`);
  } catch (error) {
    console.log(`⚠️  Categoria ${data.nome} salva, mas não publicada automaticamente`);
  }
}

async function createProduct(page: Page, data: {
  titulo: string;
  descricaoCurta: string;
  descricaoLonga: string;
  sku: string;
  preco: number;
  precoPromocional?: number;
  emPromocao: boolean;
  novoLancamento: boolean;
  estoque: number;
  vendidos: number;
  categoria: string;
}) {
  console.log(`🛍️  Criando produto: ${data.titulo}...`);

  await page.goto(`${STRAPI_URL}/admin/content-manager/collection-types/api::product.product`);
  await page.waitForLoadState('networkidle');
  await delay(1000);

  await page.click('text=Create new entry');
  await page.waitForLoadState('networkidle');
  await delay(1000);

  // Preencher campos principais
  await page.fill('input[name="titulo"]', data.titulo);
  await delay(500);

  await page.fill('textarea[name="descricaoCurta"]', data.descricaoCurta);
  await page.fill('textarea[name="descricaoLonga"]', data.descricaoLonga);
  await page.fill('input[name="sku"]', data.sku);
  await page.fill('input[name="preco"]', data.preco.toString());

  if (data.precoPromocional) {
    await page.fill('input[name="precoPromocional"]', data.precoPromocional.toString());
  }

  await page.fill('input[name="estoque"]', data.estoque.toString());
  await page.fill('input[name="vendidos"]', data.vendidos.toString());

  // Checkboxes
  if (data.emPromocao) {
    const checkbox = await page.$('input[name="emPromocao"]');
    if (checkbox && !(await checkbox.isChecked())) {
      await checkbox.check();
    }
  }

  if (data.novoLancamento) {
    const checkbox = await page.$('input[name="novoLancamento"]');
    if (checkbox && !(await checkbox.isChecked())) {
      await checkbox.check();
    }
  }

  console.log('⚠️  Atenção: Imagens e relações precisam ser configuradas manualmente');

  await delay(1000);

  // Salvar
  await page.click('button:has-text("Save")');
  await delay(2000);

  try {
    await page.click('button:has-text("Publish")');
    await delay(2000);
    console.log(`✅ Produto ${data.titulo} criado e publicado!`);
  } catch (error) {
    console.log(`⚠️  Produto ${data.titulo} salvo, mas não publicado automaticamente`);
  }
}

async function createBanner(page: Page, data: {
  titulo: string;
  subtitulo?: string;
  textoDestaque?: string;
  link?: string;
  posicao: 'hero' | 'promotional' | 'secondary';
  ordem: number;
}) {
  console.log(`🎨 Criando banner: ${data.titulo}...`);

  await page.goto(`${STRAPI_URL}/admin/content-manager/collection-types/api::banner.banner`);
  await page.waitForLoadState('networkidle');
  await delay(1000);

  await page.click('text=Create new entry');
  await page.waitForLoadState('networkidle');
  await delay(1000);

  await page.fill('input[name="titulo"]', data.titulo);

  if (data.subtitulo) {
    await page.fill('input[name="subtitulo"]', data.subtitulo);
  }

  if (data.textoDestaque) {
    await page.fill('input[name="textoDestaque"]', data.textoDestaque);
  }

  if (data.link) {
    await page.fill('input[name="link"]', data.link);
  }

  // Selecionar posição
  await page.selectOption('select[name="posicao"]', data.posicao);

  await page.fill('input[name="ordem"]', data.ordem.toString());

  // Marcar como ativo
  const ativoCheckbox = await page.$('input[name="ativo"]');
  if (ativoCheckbox && !(await ativoCheckbox.isChecked())) {
    await ativoCheckbox.check();
  }

  console.log('⚠️  Atenção: Upload de imagens precisa ser feito manualmente');

  await delay(1000);

  await page.click('button:has-text("Save")');
  await delay(2000);

  try {
    await page.click('button:has-text("Publish")');
    await delay(2000);
    console.log(`✅ Banner ${data.titulo} criado e publicado!`);
  } catch (error) {
    console.log(`⚠️  Banner ${data.titulo} salvo`);
  }
}

async function createShowcase(page: Page, data: {
  titulo: string;
  identificador: string;
  tipo: 'manual' | 'automatic';
  criterioAutomatico?: any;
  ordem: number;
  limite: number;
}) {
  console.log(`📦 Criando vitrine: ${data.titulo}...`);

  await page.goto(`${STRAPI_URL}/admin/content-manager/collection-types/api::showcase.showcase`);
  await page.waitForLoadState('networkidle');
  await delay(1000);

  await page.click('text=Create new entry');
  await page.waitForLoadState('networkidle');
  await delay(1000);

  await page.fill('input[name="titulo"]', data.titulo);
  await page.fill('input[name="identificador"]', data.identificador);

  await page.selectOption('select[name="tipo"]', data.tipo);

  if (data.criterioAutomatico) {
    await page.fill('textarea[name="criterioAutomatico"]', JSON.stringify(data.criterioAutomatico, null, 2));
  }

  await page.fill('input[name="ordem"]', data.ordem.toString());
  await page.fill('input[name="limite"]', data.limite.toString());

  const ativaCheckbox = await page.$('input[name="ativa"]');
  if (ativaCheckbox && !(await ativaCheckbox.isChecked())) {
    await ativaCheckbox.check();
  }

  await delay(1000);

  await page.click('button:has-text("Save")');
  await delay(2000);

  try {
    await page.click('button:has-text("Publish")');
    await delay(2000);
    console.log(`✅ Vitrine ${data.titulo} criada e publicada!`);
  } catch (error) {
    console.log(`⚠️  Vitrine ${data.titulo} salva`);
  }
}

async function main() {
  console.log('🚀 Iniciando população do Strapi...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Login
    await login(page);

    // Criar Categorias
    console.log('\n📂 === CRIANDO CATEGORIAS ===\n');

    const categories = [
      { nome: 'Food', slug: 'food', descricao: 'Alimentação completa e balanceada para seu pet', ordem: 1 },
      { nome: 'Outfits', slug: 'outfits', descricao: 'Roupas e acessórios estilosos para pets', ordem: 2 },
      { nome: 'Beds', slug: 'beds', descricao: 'Camas confortáveis para o descanso perfeito', ordem: 3 },
      { nome: 'Toys', slug: 'toys', descricao: 'Brinquedos divertidos e seguros', ordem: 4 },
      { nome: 'Supplements', slug: 'supplements', descricao: 'Suplementos alimentares e vitaminas', ordem: 5 },
      { nome: 'Pharmacy', slug: 'pharmacy', descricao: 'Medicamentos e produtos veterinários', ordem: 6 },
    ];

    for (const category of categories) {
      await createCategory(page, category);
    }

    // Criar Produtos
    console.log('\n🛍️  === CRIANDO PRODUTOS ===\n');

    const products = [
      {
        titulo: 'Ração Premium Cães Adultos',
        descricaoCurta: 'Ração completa e balanceada para cães adultos de todas as raças',
        descricaoLonga: 'Nutrição completa com ingredientes selecionados para cães adultos.',
        sku: 'RAC-PREM-001',
        preco: 89.90,
        precoPromocional: 79.90,
        emPromocao: true,
        novoLancamento: false,
        estoque: 50,
        vendidos: 15,
        categoria: 'food'
      },
      {
        titulo: 'Petiscos Naturais para Cães',
        descricaoCurta: 'Petiscos 100% naturais, sem conservantes',
        descricaoLonga: 'Deliciosos petiscos naturais para recompensar seu melhor amigo.',
        sku: 'PET-NAT-002',
        preco: 24.90,
        emPromocao: false,
        novoLancamento: true,
        estoque: 100,
        vendidos: 8,
        categoria: 'food'
      },
      {
        titulo: 'Coleira Ajustável Premium',
        descricaoCurta: 'Coleira ajustável de alta qualidade para cães',
        descricaoLonga: 'Coleira resistente e confortável, ajustável para todos os tamanhos.',
        sku: 'COL-ADJ-003',
        preco: 45.00,
        precoPromocional: 39.90,
        emPromocao: true,
        novoLancamento: false,
        estoque: 30,
        vendidos: 12,
        categoria: 'outfits'
      },
      {
        titulo: 'Camiseta para Pet',
        descricaoCurta: 'Camiseta confortável e estilosa para pets',
        descricaoLonga: 'Moda e conforto para seu pet ficar ainda mais lindo.',
        sku: 'CAM-PET-004',
        preco: 35.00,
        emPromocao: false,
        novoLancamento: true,
        estoque: 40,
        vendidos: 5,
        categoria: 'outfits'
      },
      {
        titulo: 'Cama Ortopédica para Cães',
        descricaoCurta: 'Cama ortopédica para o máximo conforto',
        descricaoLonga: 'Proporciona suporte ortopédico e conforto superior.',
        sku: 'CAM-ORT-005',
        preco: 189.90,
        precoPromocional: 159.90,
        emPromocao: true,
        novoLancamento: false,
        estoque: 15,
        vendidos: 20,
        categoria: 'beds'
      },
      {
        titulo: 'Bola Interativa com Som',
        descricaoCurta: 'Bola interativa que emite sons para diversão',
        descricaoLonga: 'Brinquedo inteligente que mantém seu pet entretido.',
        sku: 'BOL-INT-006',
        preco: 39.90,
        emPromocao: false,
        novoLancamento: false,
        estoque: 60,
        vendidos: 18,
        categoria: 'toys'
      },
      {
        titulo: 'Vitamina C para Pets',
        descricaoCurta: 'Suplemento de Vitamina C para fortalecer imunidade',
        descricaoLonga: 'Fortalece o sistema imunológico do seu pet.',
        sku: 'VIT-C-007',
        preco: 49.90,
        emPromocao: false,
        novoLancamento: true,
        estoque: 25,
        vendidos: 10,
        categoria: 'supplements'
      },
      {
        titulo: 'Antipulgas e Carrapatos',
        descricaoCurta: 'Proteção completa contra pulgas e carrapatos',
        descricaoLonga: 'Proteção de longa duração para seu pet.',
        sku: 'ANT-PUL-008',
        preco: 79.90,
        emPromocao: false,
        novoLancamento: false,
        estoque: 35,
        vendidos: 22,
        categoria: 'pharmacy'
      },
    ];

    for (const product of products) {
      await createProduct(page, product);
    }

    // Criar Banners
    console.log('\n🎨 === CRIANDO BANNERS ===\n');

    const banners = [
      {
        titulo: 'Bem-vindo à Pawfect Pet Care',
        subtitulo: 'Tudo para o seu melhor amigo',
        textoDestaque: 'Ver Produtos',
        link: '/shop',
        posicao: 'hero' as const,
        ordem: 1
      },
      {
        titulo: 'Promoção de Verão',
        subtitulo: 'Até 30% OFF em produtos selecionados',
        textoDestaque: 'Aproveite!',
        link: '/shop?promo=true',
        posicao: 'promotional' as const,
        ordem: 1
      },
      {
        titulo: 'Novidades da Semana',
        subtitulo: 'Confira os lançamentos',
        posicao: 'secondary' as const,
        ordem: 1
      },
    ];

    for (const banner of banners) {
      await createBanner(page, banner);
    }

    // Criar Vitrines
    console.log('\n📦 === CRIANDO VITRINES ===\n');

    const showcases = [
      {
        titulo: 'Mais Vendidos',
        identificador: 'home-bestsellers',
        tipo: 'automatic' as const,
        criterioAutomatico: { tipo: 'best_sellers', limite: 8 },
        ordem: 1,
        limite: 8
      },
      {
        titulo: 'Em Promoção',
        identificador: 'home-onsale',
        tipo: 'automatic' as const,
        criterioAutomatico: { tipo: 'on_sale', limite: 4 },
        ordem: 2,
        limite: 4
      },
      {
        titulo: 'Novidades',
        identificador: 'home-newarrivals',
        tipo: 'automatic' as const,
        criterioAutomatico: { tipo: 'new_arrivals', dias: 30, limite: 8 },
        ordem: 3,
        limite: 8
      },
    ];

    for (const showcase of showcases) {
      await createShowcase(page, showcase);
    }

    console.log('\n✅ === POPULAÇÃO CONCLUÍDA ===\n');
    console.log('⚠️  ATENÇÃO: Você ainda precisa:');
    console.log('1. Fazer upload das imagens para categorias, produtos e banners');
    console.log('2. Vincular produtos às categorias manualmente');
    console.log('3. Configurar permissões da API em Settings → Roles → Public');

  } catch (error) {
    console.error('❌ Erro durante a execução:', error);
  } finally {
    console.log('\n👋 Mantendo navegador aberto para ajustes manuais...');
    console.log('Pressione Ctrl+C para fechar quando terminar.\n');

    // Manter navegador aberto
    await delay(1000000);
    await browser.close();
  }
}

main().catch(console.error);
