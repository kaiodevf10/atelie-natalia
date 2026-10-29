// Demonstrative content: confirm commercial and teaching details with Natália.
// This file is used exclusively by /cursos.
export const courses = [
    {
        title: 'Curso de automaquiagem',
        duration: '1 dia, 4 horas', format: 'Presencial', classSize: 'Até 6 alunas',
        certificate: 'Certificado de participação', material: 'Produtos para a prática incluídos',
        price: 'R$ 280', payment: 'Dinheiro, Pix ou cartão em até 3x',
    },
    {
        title: 'Curso profissional de maquiagem',
        duration: '4 encontros, 16 horas', format: 'Presencial', classSize: 'Até 8 alunas',
        certificate: 'Certificado de conclusão', material: 'Apostila incluída; kit de produtos à parte',
        price: 'R$ 1.000', payment: 'Dinheiro, Pix ou cartão em até 6x',
    },
] as const;
export const courseOptions = [courses[0].title, courses[1].title, 'Ainda não sei, quero orientação'] as const;
export const courseLevels = ['Nunca maquiei', 'Já me maquio', 'Já atuo na área'] as const;
export const courseDisclaimer = 'Informações e valores ilustrativos para demonstração. Sujeitos à confirmação com o ateliê.';
export const courseFAQs = [
    {
        group: 'Cursos', q: 'Qual curso é o ideal para mim?',
        a: "O curso de automaquiagem é para quem quer se maquiar melhor para si, no dia a dia ou em eventos. O curso profissional é para quem quer aprender a maquiar outras pessoas e atuar na área. Se ainda estiver em dúvida, escolha 'Ainda não sei, quero orientação' no formulário e a gente ajuda você a decidir.",
    },
    {
        group: 'Cursos', q: 'Preciso ter experiência para fazer o curso?',
        a: 'Não. Os cursos recebem desde quem nunca maquiou até quem já atua na área, e você indica o seu nível no formulário para a gente conduzir do jeito certo.',
    },
    {
        group: 'Cursos', q: 'Preciso levar meus produtos?',
        a: 'No curso de automaquiagem, os produtos para a prática estão incluídos. No curso profissional, a apostila está incluída e o kit de produtos é à parte. A gente orienta o que levar pelo WhatsApp.',
    },
];
