import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { device } from '../styles';
import CookieBig from './CookieBig';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify: center;
  border-radius: 30px;
  background: white;
  padding: 30px 20px 35px;
  width: 100%;

  @media ${device.from.tablet} {
    flex-direction: row;
    padding: 48px 46px 33px;
    max-width: 819px;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  margin-bottom: 30px;
  width: 101px;
  height: 100px;

  @media ${device.from.tablet} {
    width: 202px;
    height: 200px;
  }
`;

const TextSection = styled.div`
  width: 100%;
  @media ${device.from.tablet} {
    margin-left: 45px;
  }
`;

const Title = styled.h1`
  font-size: 22px;
  margin-bottom: 25px;
  text-align: center;

  @media ${device.from.tablet} {
    margin-bottom: 30px;
    text-align: left;
  }
`;

const Paragraph = styled.div`
  margin-bottom: 25px;
  font-size: 14px;
  line-height: 15px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  margin-bottom: 30px;

  @media ${device.from.tablet} {
    flex-wrap: wrap;
    margin-bottom: 24px;
  }
`;

const OutlineButton = styled.button`
  background: white;
  border-radius: 5px;
  border: 1px solid blue;
  border: 2px solid #0063af;
  color: #0063af;
  border-radius: 90px;
  margin-right: 16px;
  width: 230px;
  height: 47px;

  @media ${device.from.tablet} {
    margin-bottom: 16px;
  }
`;

const SolidButton = styled.button`
  background: linear-gradient(90deg, #f28d00 0%, #f9ba6e 100%);
  border-radius: 90px;
  color: white;
  width: 233px;
  height: 47px;

  @media ${device.from.tablet} {
    margin-bottom: 16px;
  }
`;

const Options = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  > button {
    font-size: 14px;

    &:first-of-type {
      margin-right: 29px;
    }
  }

  @media ${device.from.tablet} {
    justify-content: flex-end;
  }
`;

const MoreOptions = styled.a`
  background: linear-gradient(50.19deg, #36a9e0 2.84%, #0367b2 106.82%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  margin-bottom: 29px;
  flex-basis: 100%;
  text-align: center;

  @media ${device.from.tablet} {
    margin-bottom: 0px;
    margin-right: 29px;
    flex-basis: unset;
  }
`;

const CookieBanner = ({ onAccept, onExit, toImpressumFunc, toPrivacyFunc }) => {
  const { t } = useTranslation();

  return (
    <Container>
      <ImageWrapper>
        <CookieBig />
      </ImageWrapper>
      <TextSection>
        <Title>{t('title')}</Title>
        <Paragraph>
          <b>{t('paragraph1')}</b>
          <ul>
            <li>{t('listItem1')}</li>
            <li>{t('listItem2')}</li>
            <li>{t('listItem3')}</li>
          </ul>
        </Paragraph>
        <Paragraph>
          <b>{t('paragraph2')}</b>
          <ul>
            <li>{t('listItem4')}</li>
            <li>{t('listItem5')}</li>
          </ul>
        </Paragraph>
        <ButtonsContainer>
          <OutlineButton type="button" onClick={onExit}>
            {t('declineButton')}
          </OutlineButton>
          <SolidButton type="button" onClick={onAccept}>
            {t('acceptButton')}
          </SolidButton>
        </ButtonsContainer>
        <Options>
          <MoreOptions href="/cookies" style={{ display: 'none' }}>
            {t('moreOptions')}
          </MoreOptions>
          <button onClick={toImpressumFunc}>{t('impressum')}</button>
          <button onClick={toPrivacyFunc}>{t('dataPrivacy')}</button>
        </Options>
      </TextSection>
    </Container>
  );
};

export default CookieBanner;
