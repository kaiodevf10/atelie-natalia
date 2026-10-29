export const photos = {
    hero: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1600&q=85',
    bride: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85',
    makeup: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1000&q=85',
    hair: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1000&q=85',
    beauty: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=85',
    tools: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=85',
};
export const services = [
    { id: 'maquiagem', slug: 'maquiagem-social', name: 'Maquiagem social', description: 'Uma produção que acompanha seu estilo, da beleza natural a um olhar marcante.', image: photos.makeup, occasion: 'Festas, formaturas, ensaios e ocasiões especiais' },
    { id: 'penteado', slug: 'penteados', name: 'Penteados', description: 'Texturas, formas e detalhes para expressar sua personalidade em cada ocasião.', image: photos.hair, occasion: 'Eventos, celebrações e ensaios' },
    { id: 'completo', slug: 'maquiagem-e-penteado', name: 'Maquiagem + penteado', description: 'Beleza em harmonia. Maquiagem e cabelo pensados juntos para o seu momento.', image: photos.beauty, occasion: 'Uma produção completa para sua ocasião' },
    { id: 'noiva', slug: 'producao-para-noivas', name: 'Produção para noivas', description: 'Um olhar atento à sua história e aos detalhes do dia que você tanto espera.', image: photos.bride, occasion: 'Casamentos e celebrações de união' },
] as const;
export const categories = ['Maquiagem social', 'Noivas', 'Penteados'] as const;
export type PortfolioCategory = typeof categories[number];
export const portfolio: { id: number; image: string; category: PortfolioCategory; title: string }[] = [
    { id: 1, image: photos.makeup, category: 'Maquiagem social', title: 'Pele iluminada, beleza natural' },
    { id: 2, image: photos.bride, category: 'Noivas', title: 'A delicadeza de celebrar' },
    { id: 3, image: photos.hair, category: 'Penteados', title: 'Texturas e movimento' },
    { id: 5, image: photos.tools, category: 'Maquiagem social', title: 'Detalhes do universo da maquiagem' },
    { id: 6, image: photos.bride, category: 'Noivas', title: 'Inspiração para o grande dia' },
];
export const makeupStyles = ['Natural e delicada', 'Soft glam', 'Clássica e elegante', 'Marcante', 'Gostaria de orientação'];
export const hairStyles = ['Solto', 'Semipreso', 'Preso', 'Ondas', 'Outro', 'Gostaria de orientação'];
export const courseOptions = ['Curso profissionalizante de maquiagem', 'Quero conhecer as opções'];
export const team: {
    name: string;
    specialty: string;
    bio: string;
    image: string;
}[] = [];
export const about = 'À frente do Ateliê Natália Lucena, Natália une sua atuação como maquiadora à dedicação ao universo das noivas e ao ensino profissionalizante.\n\nSeu trabalho busca valorizar a individualidade de cada mulher, criando produções que acompanham sua personalidade e os momentos que deseja celebrar.\n\nAo lado de sua equipe, leva esse cuidado aos atendimentos de maquiagem e penteado, enquanto compartilha conhecimento com quem deseja se desenvolver na área da beleza.';
export const faqs = [
    { group: 'Agendamentos', q: 'Como solicito um atendimento?', a: 'Personalize sua solicitação no site e revise o resumo. Ao continuar pelo WhatsApp, você envia a mensagem para a equipe consultar a disponibilidade e orientar os próximos passos.' },
    { group: 'Agendamentos', q: 'Escolher uma data garante minha reserva?', a: 'Não. A data e o horário são preferências. A disponibilidade e as condições do atendimento serão confirmadas pela equipe na conversa.' },
    { group: 'Serviços', q: 'Posso levar uma referência de maquiagem ou penteado?', a: 'Sim. Inclua links de inspiração na sua solicitação. Fotos também podem ser enviadas diretamente na conversa do WhatsApp.' },
    { group: 'Noivas', q: 'Como funciona o atendimento para noivas?', a: 'Começamos pelas suas preferências, data e local de preparação. A equipe conversa com você sobre os detalhes e apresenta as possibilidades de atendimento.' },
    { group: 'Noivas', q: 'Posso consultar produção para acompanhantes?', a: 'Sim. Informe a quantidade de pessoas e marque seu interesse em atendimento para acompanhantes no formulário. A equipe avaliará a possibilidade.' },
    { group: 'Local de atendimento', q: 'Onde fica o ateliê?', a: 'O ateliê fica em Niterói, RJ. Consulte a equipe para confirmar o endereço completo e as orientações de chegada antes do atendimento.' },
    { group: 'Pagamentos', q: 'Quais são os valores e as formas de pagamento?', a: 'Os valores e as condições de pagamento devem ser consultados com a equipe conforme sua solicitação.' },
    { group: 'Reagendamentos', q: 'Como posso alterar a data do meu atendimento?', a: 'Entre em contato com a equipe para consultar a disponibilidade e as condições aplicáveis ao seu atendimento.' },
    { group: 'Cursos', q: 'Como recebo informações sobre os cursos?', a: 'Preencha o formulário de interesse na página de cursos. A equipe poderá informar turmas, conteúdo, valores, carga horária e condições. O formulário não confirma inscrição nem reserva de vaga.' },
];
