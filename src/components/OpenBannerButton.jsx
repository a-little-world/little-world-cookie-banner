import styled from 'styled-components';
import CookieSmall from './CookieSmall';

const StyledButton = styled.button`
  position: absolute;
  padding: 5px;
  width: 60px;
  height: 60px;
  border-radius: 80px;
  background-color: transparent;
  background-repeat: no-repeat;
  background-size: contain;
  left: 0;
  bottom: 0;
`;

const OpenBannerButton = ({ onClick }) => {
  return (
    <StyledButton className="bloo-balh" onClick={onClick}>
      <CookieSmall />
    </StyledButton>
  );
};

export default OpenBannerButton;
