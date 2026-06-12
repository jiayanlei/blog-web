import ShinyText from '../reactbits/ShinyText';

type NodeHeaderProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  align?: 'left' | 'center';
};

function NodeHeader({ id, eyebrow, title, description, align = 'left' }: NodeHeaderProps) {
  return (
    <header className={align === 'center' ? 'node-header node-header--center' : 'node-header'}>
      <p>{eyebrow}</p>
      <h2 id={id}>
        <ShinyText speed={5.2}>{title}</ShinyText>
      </h2>
      <strong>{description}</strong>
    </header>
  );
}

export default NodeHeader;
