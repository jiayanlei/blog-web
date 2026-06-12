import SpotlightCard from './SpotlightCard';

type MagicBentoItem = {
  title: string;
  text: string;
  tone: string;
  span?: 'wide' | 'tall';
};

type MagicBentoProps = {
  items: MagicBentoItem[];
};

function MagicBento({ items }: MagicBentoProps) {
  return (
    <div className="rb-magic-bento">
      {items.map((item, index) => (
        <SpotlightCard
          className={`rb-bento-tile rb-bento-tile--${item.tone}${item.span ? ` rb-bento-tile--${item.span}` : ''}`}
          intensity="rgba(96, 165, 250, 0.16)"
          key={item.title}
        >
          <div className="rb-bento-index">0{index + 1}</div>
          <span className="rb-bento-orb" aria-hidden="true" />
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </SpotlightCard>
      ))}
    </div>
  );
}

export default MagicBento;
