import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { device } from '../styles';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 30px;
  background: white;
  padding: 30px 20px 35px;
  width: 100%;
  max-height: 86vh;
  overflow-y: auto;

  @media ${device.from.tablet} {
    padding: 40px 46px 33px;
    max-width: 819px;
  }
`;

const Title = styled.h1`
  font-size: 22px;
  margin-bottom: 12px;
`;

const Intro = styled.p`
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 24px;
`;

const GroupCard = styled.section`
  border: 1px solid #e3e8ee;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
`;

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const GroupName = styled.h2`
  font-size: 16px;
  margin: 0;
`;

const RequiredTag = styled.span`
  border: 1px solid #0063af;
  border-radius: 90px;
  color: #0063af;
  font-size: 12px;
  padding: 2px 10px;
  white-space: nowrap;
`;

const GroupDescription = styled.p`
  color: #4a5568;
  font-size: 13px;
  line-height: 18px;
  margin: 8px 0 12px;
`;

const ToggleRow = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 14px;
`;

const Toggle = styled.span`
  position: relative;
  display: inline-block;
  width: 46px;
  height: 26px;
  flex-shrink: 0;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #0063af;
  }

  &:checked + span::before {
    transform: translateX(20px);
  }

  &:disabled + span {
    opacity: 0.6;
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  inset: 0;
  background-color: #cbd5e0;
  border-radius: 90px;
  transition: background-color 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    left: 3px;
    top: 3px;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.2s ease;
  }
`;

const CookieSummary = styled.summary`
  cursor: pointer;
  color: #0063af;
  font-size: 13px;
  margin-top: 12px;
`;

const CookieList = styled.ul`
  margin: 10px 0 0;
  padding-left: 18px;
  font-size: 12px;
  color: #4a5568;
`;

const CookieItem = styled.li`
  margin-bottom: 8px;
`;

const CookieMeta = styled.div`
  color: #718096;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const ActionButton = styled.button`
  border-radius: 90px;
  font-size: 14px;
  height: 47px;
  min-width: 160px;
  padding: 0 20px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(ActionButton)`
  background: white;
  border: 2px solid #0063af;
  color: #0063af;
`;

const PrimaryButton = styled(ActionButton)`
  background: linear-gradient(90deg, #f28d00 0%, #f9ba6e 100%);
  color: white;
`;

const LinkButton = styled.button`
  align-self: flex-start;
  color: #0063af;
  font-size: 14px;
  margin-bottom: 16px;
`;

const Feedback = styled.p`
  color: ${({ $error }) => ($error ? '#c53030' : '#2f855a')};
  font-size: 14px;
  margin-bottom: 12px;
  text-align: center;
`;

const CookieGroupCard = ({ group, checked, onToggle }) => {
  const { t } = useTranslation();
  const name = t(`groups.${group.varname}.name`, { defaultValue: group.name });
  const description = t(`groups.${group.varname}.description`, {
    defaultValue: group.description,
  });

  return (
    <GroupCard>
      <GroupHeader>
        <GroupName>{name}</GroupName>
        {group.required && <RequiredTag>{t('requiredBadge')}</RequiredTag>}
      </GroupHeader>
      {description && <GroupDescription>{description}</GroupDescription>}
      <ToggleRow>
        <span>{t('toggleLabel')}</span>
        <Toggle>
          <ToggleInput
            type="checkbox"
            name={group.varname}
            checked={group.required ? true : checked}
            disabled={group.required}
            onChange={event => onToggle(group.varname, event.target.checked)}
          />
          <ToggleSlider />
        </Toggle>
      </ToggleRow>
      {group.cookies.length > 0 && (
        <details>
          <CookieSummary>{t('showCookies')}</CookieSummary>
          <CookieList>
            {group.cookies.map(cookie => (
              <CookieItem key={`${cookie.name}-${cookie.domain}${cookie.path}`}>
                <div>{cookie.name}</div>
                {cookie.description && (
                  <CookieMeta>{cookie.description}</CookieMeta>
                )}
                <CookieMeta>
                  {cookie.domain}
                  {cookie.path}
                </CookieMeta>
              </CookieItem>
            ))}
          </CookieList>
        </details>
      )}
    </GroupCard>
  );
};

const CookieSettings = ({
  groups,
  preferences,
  onToggle,
  onAcceptAll,
  onDeclineAll,
  onSave,
  onBack,
  saving,
  saved,
  saveFailed,
}) => {
  const { t } = useTranslation();

  return (
    <Container>
      <LinkButton type="button" onClick={onBack}>
        {t('back')}
      </LinkButton>
      <Title>{t('settingsTitle')}</Title>
      <Intro>{t('settingsIntro')}</Intro>
      {groups.map(group => (
        <CookieGroupCard
          key={group.varname}
          group={group}
          checked={preferences[group.varname] ?? false}
          onToggle={onToggle}
        />
      ))}
      {saved && <Feedback>{t('saved')}</Feedback>}
      {saveFailed && <Feedback $error>{t('saveError')}</Feedback>}
      <Actions>
        <SecondaryButton type="button" onClick={onDeclineAll} disabled={saving}>
          {t('declineButton')}
        </SecondaryButton>
        <SecondaryButton type="button" onClick={onAcceptAll} disabled={saving}>
          {t('acceptButton')}
        </SecondaryButton>
        <PrimaryButton type="button" onClick={onSave} disabled={saving}>
          {t('saveButton')}
        </PrimaryButton>
      </Actions>
    </Container>
  );
};

export default CookieSettings;
