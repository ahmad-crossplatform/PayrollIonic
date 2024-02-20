import {
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonNote,
} from "@ionic/react";
import styled from "styled-components";
import moment from "moment";
import { mailUnread } from "ionicons/icons";
import { IPayslip } from "../atoms/payslipAtom";
import { dateFormat } from "../helper/dateFormatter";

interface IProps {
  payslip: IPayslip;
  onSetAsUnread: () => void;
  onClick: () => void;
}

export const PayslipListItem: React.FC<IProps> = ({
  payslip,
  onClick,
  onSetAsUnread,
}) => {
  return (
    <IonItemSliding>
      <Item routerLink={`/payslip/${payslip.id}`} button onClick={onClick}>
        <div
          slot="start"
          className={payslip.isNew ? "dot dot-unread" : "dot"}
        />

        <Label className="ion-text-wrap">
          <h2>
            Payment for {dateFormat(payslip.fromDate, "YYYY-MM-DD")}
            <span className="date">
              <IonNote>{dateFormat(payslip.fromDate, "DD MMM")}</IonNote>
            </span>
          </h2>
        </Label>
      </Item>
      <IonItemOptions slot="end">
        {!payslip.isNew && (
          <IonItemOption color="primary" onClick={onSetAsUnread}>
            <IonIcon slot="icon-only" icon={mailUnread}></IonIcon>
          </IonItemOption>
        )}
      </IonItemOptions>
    </IonItemSliding>
  );
};

const Item = styled(IonItem)`
  --padding-start: 0;
  h2 {
    font-weight: 600;
    margin: 0;

    /**
   * With larger font scales
   * the date/time should wrap to the next
   * line. However, there should be
   * space between the name and the date/time
   * if they can appear on the same line.
   */
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  p {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 95%;
  }

  .date {
    align-items: center;
    display: flex;
  }

  ion-icon {
    color: #c9c9ca;
  }

  ion-note {
    font-size: 0.9375rem;
    margin-right: 8px;
    font-weight: normal;
  }

  ion-note.md {
    margin-right: 14px;
  }

  .dot {
    display: block;
    height: 12px;
    width: 12px;
    border-radius: 50%;
    align-self: start;
    margin: 16px 10px 16px 16px;
  }
  .dot-unread {
    background: var(--ion-color-primary);
  }

  ion-footer ion-title {
    font-size: 11px;
    font-weight: normal;
  }
`;

const Label = styled(IonLabel)`
  margin-top: 12px;
  margin-bottom: 12px;
`;
