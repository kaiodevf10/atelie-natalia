type BrandConfig = {
    name: string;
    shortName: string;
    city: string;
    address: string | null;
    hours: string | null;
    instagram: string;
    founderInstagram: string;
    linktree: string;
    bio: string;
};

export const brand: BrandConfig = {
    name: 'Ateliê Natália Lucena',
    shortName: 'Natália Lucena',
    city: 'Niterói, RJ',
    // Preencher somente com o endereço completo oficialmente confirmado.
    // O mapa e a rota da página do espaço usam automaticamente este mesmo valor.
    address: null,
    hours: null,
    instagram: 'https://www.instagram.com/atelienatalialucena/',
    founderInstagram: 'https://www.instagram.com/natalialucenamaquiadora/',
    linktree: 'https://linktr.ee/natluccena',
    bio: 'https://bio.site/atelienatalialuccena',
};
export const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined;
