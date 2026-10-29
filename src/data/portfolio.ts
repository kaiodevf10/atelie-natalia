import type { PortfolioCategory } from './content';

// Pexels License: https://www.pexels.com/license/
// Illustrative third-party photographs, never presented as the atelier's work.
// Replace image/alt/position here when the official photographs are available.
export type PortfolioReference = {
    id: number;
    image: string;
    category: PortfolioCategory;
    title: string;
    position?: string;
    source: string;
};

const groups: { category: PortfolioCategory; photos: [number, string][] }[] = [
    { category: 'Maquiagem social', photos: [
        [5856399, 'Maquiagem natural com acabamento delicado'],
        [4936962, 'Maquiagem de festa com sombra dourada e batom escuro'],
        [13111258, 'Maquiagem marcante em luz natural'],
        [8221029, 'Batom intenso e maquiagem colorida nos olhos'],
        [23891632, 'Maquiagem de olhos esfumados em retrato de estúdio'],
    ] },
    { category: 'Noivas', photos: [
        [32588057, 'Noiva com vestido de renda durante a preparação'],
        [34362514, 'Noiva sorrindo durante a aplicação da maquiagem'],
        [12346564, 'Maquiagem de noiva sendo finalizada no estúdio'],
        [29569638, 'Preparação da beleza da noiva com acessórios de cabelo'],
        [38530639, 'Retoques finais da maquiagem no dia do casamento'],
    ] },
    { category: 'Penteados', photos: [
        [20820138, 'Coque com laço preto em cabelo castanho'],
        [38714663, 'Cabelo longo solto com ondas visto de costas'],
        [9489719, 'Cabelo loiro com textura e ondas suaves'],
        [10608463, 'Cabelo loiro sendo organizado em coque preso'],
        [18547994, 'Penteado preso com tranças para uma ocasião especial'],
    ] },
];

export const portfolioReferences: PortfolioReference[] = groups.flatMap(({ category, photos }) =>
    photos.map(([id, title]) => ({
        id, category, title,
        image: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`,
        source: `https://www.pexels.com/photo/${id}/`,
    })),
);
