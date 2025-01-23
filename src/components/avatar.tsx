interface AvatarProps {
  image: string;
  size?: number;
}

export default function Avatar({ image, size = 90 }: AvatarProps) {
  const css = `
    background-image: url("${image}");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    min-height: ${size}px;
    min-width: ${size}px;
    border-radius: 8px;
  `;
  return <box css={css} />;
}
