/**
 * Script para popular o Strapi usando a API REST
 * Mais confiável que automação de browser
 */

import axios from 'axios';

const STRAPI_URL = 'http://localhost:1337';
const EMAIL = 'joeljunior.dev@gmail.com';
const PASSWORD = 'Teste@123';

let jwt: string = '';

// Função de delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Login e obter JWT
async function login() {
  console.log('📝 Fazendo login no Strapi...');

  try {
    const response = await axios.post(`${STRAPI_URL}/admin/login`, {
      email: EMAIL,
      password: PASSWORD,
    });

    jwt = response.data.data.token;
    console.log('✅ Login realizado com sucesso!');
    return jwt;
  } catch (error: any) {
    console.error('❌ Erro no login:', error.response?.data || error.message);
    throw error;
  }
}

// Criar categoria
async function createCategory(data: {
  nome: string;
  slug: string;
  descricao: string;
  ordem: number;
  ativa: boolean;
}) {
  console.log(`📁 Criando categoria: ${data.nome}...`);

  try {
    const response = await axios.post(
      `${STRAPI_URL}/api/categories`,
      { data },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const categoryId = response.data.data.id;

    // Publicar a categoria
    await axios.post(
      `${STRAPI_URL}/api/categories/${categoryId}/actions/publish`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    console.log(`✅ Categoria ${data.nome} criada e publicada!`);
    return categoryId;
  } catch (error: any) {
    console.error(`❌ Erro ao criar categoria ${data.nome}:`, error.response?.data || error.message);
    throw error;
  }
}

// Criar produto
async function createProduct(data: {
  titulo: string;
  slug: string;
  descricaoCurta: string;
  descricaoLonga: string;
  sku: string;
  preco: number;
  precoPromocional?: number;
  emPromocao: boolean;
  novoLancamento: boolean;
  estoque: number;
  vendidos: number;
  tamanhos?: Array<{ nome: string; disponivel: boolean }>;
  categorias?: number[];
}) {
  console.log(`🛍️  Criando produto: ${data.titulo}...`);

  try {
    const response = await axios.post(
      `${STRAPI_URL}/api/products`,
      { data },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const productId = response.data.data.id;

    // Publicar o produto
    await axios.post(
      `${STRAPI_URL}/api/products/${productId}/actions/publish`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    console.log(`✅ Produto ${data.titulo} criado e publicado!`);
    return productId;
  } catch (error: any) {
    console.error(`❌ Erro ao criar produto ${data.titulo}:`, error.response?.data || error.message);
    throw error;
  }
}

// Criar banner
async function createBanner(data: {
  titulo: string;
  subtitulo?: string;
  textoDestaque?: string;
  link?: string;
  posicao: string;
  ordem: number;
  ativo: boolean;
}) {
  console.log(`🎨 Criando banner: ${data.titulo}...`);

  try {
    const response = await axios.post(
      `${STRAPI_URL}/api/banners`,
      { data },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const bannerId = response.data.data.id;

    // Publicar o banner
    await axios.post(
      `${STRAPI_URL}/api/banners/${bannerId}/actions/publish`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    console.log(`✅ Banner ${data.titulo} criado e publicado!`);
    return bannerId;
  } catch (error: any) {
    console.error(`❌ Erro ao criar banner ${data.titulo}:`, error.response?.data || error.message);
    throw error;
  }
}

// Criar vitrine
async function createShowcase(data: {
  titulo: string;
  identificador: string;
  tipo: string;
  criterioAutomatico?: any;
  ordem: number;
  limite: number;
  ativa: boolean;
  produtos?: number[];
}) {
  console.log(`🏪 Criando vitrine: ${data.titulo}...`);

  try {
    const response = await axios.post(
      `${STRAPI_URL}/api/showcases`,
      { data },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const showcaseId = response.data.data.id;

    // Publicar a vitrine
    await axios.post(
      `${STRAPI_URL}/api/showcases/${showcaseId}/actions/publish`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    console.log(`✅ Vitrine ${data.titulo} criada e publicada!`);
    return showcaseId;
  } catch (error: any) {
    console.error(`❌ Erro ao criar vitrine ${data.titulo}:`, error.response?.data || error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Iniciando população do Strapi via API...\n');

    // Login
    await login();
    await delay(1000);

    // Criar categorias
    console.log('\n📂 === CRIANDO CATEGORIAS ===\n');

    const categoryIds: Record<string, number> = {};

    categoryIds.food = await createCategory({
      nome: 'Food',
      slug: 'food',
      descricao: 'Alimentação completa para seu pet',
      ordem: 1,
      ativa: true,
    });
    await delay(500);

    categoryIds.outfits = await createCategory({
      nome: 'Outfits',
      slug: 'outfits',
      descricao: 'Roupas e acessórios para pets',
      ordem: 2,
      ativa: true,
    });
    await delay(500);

    categoryIds.beds = await createCategory({
      nome: 'Beds',
      slug: 'beds',
      descricao: 'Camas confortáveis',
      ordem: 3,
      ativa: true,
    });
    await delay(500);

    categoryIds.toys = await createCategory({
      nome: 'Toys',
      slug: 'toys',
      descricao: 'Brinquedos divertidos',
      ordem: 4,
      ativa: true,
    });
    await delay(500);

    categoryIds.supplements = await createCategory({
      nome: 'Supplements',
      slug: 'supplements',
      descricao: 'Suplementos alimentares',
      ordem: 5,
      ativa: true,
    });
    await delay(500);

    categoryIds.pharmacy = await createCategory({
      nome: 'Pharmacy',
      slug: 'pharmacy',
      descricao: 'Medicamentos veterinários',
      ordem: 6,
      ativa: true,
    });
    await delay(500);

    // Criar produtos
    console.log('\n🛍️  === CRIANDO PRODUTOS ===\n');

    const productIds: number[] = [];

    productIds.push(
      await createProduct({
        titulo: 'Ração Premium Cães Adultos',
        slug: 'racao-premium-caes-adultos',
        descricaoCurta: 'Ração completa e balanceada para cães adultos de todas as raças',
        descricaoLonga: 'Ração Premium desenvolvida especialmente para cães adultos, com ingredientes selecionados e balanceamento nutricional ideal para manter a saúde e vitalidade do seu pet.',
        sku: 'RAC-PREM-001',
        preco: 89.90,
        precoPromocional: 79.90,
        emPromocao: true,
        novoLancamento: false,
        estoque: 50,
        vendidos: 15,
        tamanhos: [
          { nome: '1kg', disponivel: true },
          { nome: '3kg', disponivel: true },
          { nome: '10kg', disponivel: true },
        ],
        categorias: [categoryIds.food],
      })
    );
    await delay(500);

    productIds.push(
      await createProduct({
        titulo: 'Petiscos Naturais',
        slug: 'petiscos-naturais',
        descricaoCurta: 'Petiscos 100% naturais sem conservantes',
        descricaoLonga: 'Petiscos naturais feitos com ingredientes selecionados, sem conservantes artificiais. Ideal para treino e recompensa.',
        sku: 'PET-NAT-001',
        preco: 24.90,
        emPromocao: false,
        novoLancamento: true,
        estoque: 100,
        vendidos: 45,
        categorias: [categoryIds.food],
      })
    );
    await delay(500);

    productIds.push(
      await createProduct({
        titulo: 'Coleira Ajustável',
        slug: 'coleira-ajustavel',
        descricaoCurta: 'Coleira resistente e confortável',
        descricaoLonga: 'Coleira ajustável de nylon resistente, disponível em diversos tamanhos e cores. Perfeita para passeios diários.',
        sku: 'COL-AJU-001',
        preco: 39.90,
        precoPromocional: 29.90,
        emPromocao: true,
        novoLancamento: false,
        estoque: 75,
        vendidos: 28,
        tamanhos: [
          { nome: 'P', disponivel: true },
          { nome: 'M', disponivel: true },
          { nome: 'G', disponivel: true },
        ],
        categorias: [categoryIds.outfits],
      })
    );
    await delay(500);

    productIds.push(
      await createProduct({
        titulo: 'Camiseta para Pet',
        slug: 'camiseta-para-pet',
        descricaoCurta: 'Camiseta confortável e estilosa',
        descricaoLonga: 'Camiseta 100% algodão para seu pet ficar quentinho e estiloso. Diversos modelos disponíveis.',
        sku: 'CAM-PET-001',
        preco: 44.90,
        emPromocao: false,
        novoLancamento: true,
        estoque: 60,
        vendidos: 12,
        tamanhos: [
          { nome: 'PP', disponivel: true },
          { nome: 'P', disponivel: true },
          { nome: 'M', disponivel: true },
          { nome: 'G', disponivel: false },
        ],
        categorias: [categoryIds.outfits],
      })
    );
    await delay(500);

    productIds.push(
      await createProduct({
        titulo: 'Cama Ortopédica',
        slug: 'cama-ortopedica',
        descricaoCurta: 'Cama ortopédica com espuma de memória',
        descricaoLonga: 'Cama ortopédica premium com espuma de memória, proporcionando máximo conforto e suporte para seu pet. Ideal para cães idosos ou com problemas articulares.',
        sku: 'CAM-ORT-001',
        preco: 189.90,
        precoPromocional: 159.90,
        emPromocao: true,
        novoLancamento: false,
        estoque: 25,
        vendidos: 8,
        tamanhos: [
          { nome: 'M', disponivel: true },
          { nome: 'G', disponivel: true },
          { nome: 'GG', disponivel: true },
        ],
        categorias: [categoryIds.beds],
      })
    );
    await delay(500);

    productIds.push(
      await createProduct({
        titulo: 'Bola Interativa',
        slug: 'bola-interativa',
        descricaoCurta: 'Bola com dispenser de petiscos',
        descricaoLonga: 'Bola interativa que dispensa petiscos durante a brincadeira, estimulando a atividade física e mental do seu pet.',
        sku: 'BOL-INT-001',
        preco: 49.90,
        emPromocao: false,
        novoLancamento: true,
        estoque: 80,
        vendidos: 22,
        categorias: [categoryIds.toys],
      })
    );
    await delay(500);

    productIds.push(
      await createProduct({
        titulo: 'Vitamina C para Pets',
        slug: 'vitamina-c-para-pets',
        descricaoCurta: 'Suplemento de vitamina C',
        descricaoLonga: 'Suplemento de vitamina C de alta qualidade para fortalecer o sistema imunológico do seu pet.',
        sku: 'VIT-C-001',
        preco: 64.90,
        emPromocao: false,
        novoLancamento: false,
        estoque: 40,
        vendidos: 18,
        categorias: [categoryIds.supplements],
      })
    );
    await delay(500);

    productIds.push(
      await createProduct({
        titulo: 'Antipulgas',
        slug: 'antipulgas',
        descricaoCurta: 'Antipulgas de longa duração',
        descricaoLonga: 'Antipulgas eficaz com proteção de até 30 dias. Fácil aplicação e resultados comprovados.',
        sku: 'ANT-PUL-001',
        preco: 54.90,
        precoPromocional: 44.90,
        emPromocao: true,
        novoLancamento: false,
        estoque: 120,
        vendidos: 67,
        categorias: [categoryIds.pharmacy],
      })
    );
    await delay(500);

    // Criar banners
    console.log('\n🎨 === CRIANDO BANNERS ===\n');

    await createBanner({
      titulo: 'Bem-vindo à Pawfect Pet Care',
      subtitulo: 'Tudo para o seu melhor amigo',
      textoDestaque: 'Ver Produtos',
      link: '/shop',
      posicao: 'hero',
      ordem: 1,
      ativo: true,
    });
    await delay(500);

    await createBanner({
      titulo: 'Promoção de Verão',
      subtitulo: 'Até 30% OFF',
      textoDestaque: 'Aproveite!',
      posicao: 'promotional',
      ordem: 1,
      ativo: true,
    });
    await delay(500);

    await createBanner({
      titulo: 'Novidades da Semana',
      posicao: 'secondary',
      ordem: 1,
      ativo: true,
    });
    await delay(500);

    // Criar vitrines
    console.log('\n🏪 === CRIANDO VITRINES ===\n');

    await createShowcase({
      titulo: 'Mais Vendidos',
      identificador: 'home-bestsellers',
      tipo: 'automatic',
      criterioAutomatico: {
        tipo: 'best_sellers',
        limite: 8,
      },
      ordem: 1,
      limite: 8,
      ativa: true,
    });
    await delay(500);

    await createShowcase({
      titulo: 'Em Promoção',
      identificador: 'home-onsale',
      tipo: 'automatic',
      criterioAutomatico: {
        tipo: 'on_sale',
        limite: 4,
      },
      ordem: 2,
      limite: 4,
      ativa: true,
    });
    await delay(500);

    await createShowcase({
      titulo: 'Novidades',
      identificador: 'home-newarrivals',
      tipo: 'automatic',
      criterioAutomatico: {
        tipo: 'new_arrivals',
        dias: 30,
        limite: 8,
      },
      ordem: 3,
      limite: 8,
      ativa: true,
    });

    console.log('\n✅ === POPULAÇÃO CONCLUÍDA COM SUCESSO! ===\n');
    console.log('📊 Resumo:');
    console.log(`   - 6 categorias criadas e publicadas`);
    console.log(`   - 8 produtos criados e publicados`);
    console.log(`   - 3 banners criados e publicados`);
    console.log(`   - 3 vitrines criadas e publicadas`);
    console.log('\n⚠️  Lembre-se de fazer upload das imagens manualmente no Strapi Admin!');
    console.log('🔗 Acesse: http://localhost:1337/admin\n');

  } catch (error: any) {
    console.error('\n❌ Erro durante a execução:', error.message);
    process.exit(1);
  }
}

main();
