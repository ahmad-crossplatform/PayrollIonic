import {
  IonContent,
  IonHeader,
  IonItemDivider,
  IonItemGroup,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useAtom } from "jotai";

import { payslipAtom } from "../atoms/payslipAtom";
import { PayslipListItem } from "../components/PayslipListItem";
import { dateFormat } from "../helper/dateFormatter";

export const PayslipListPage: React.FC = () => {
  const [payslips, setPayslips] = useAtom(payslipAtom);

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Payslips</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {payslips
            .sort((a, b) => b.fromDate.getTime() - a.fromDate.getTime())
            .map((p, index) => (
              <IonItemGroup key={index}>
                <IonItemDivider>
                  {dateFormat(p.fromDate, "MMMM YYYY")}
                </IonItemDivider>
                <PayslipListItem
                  key={p.id}
                  payslip={p}
                  onClick={() => {
                    setPayslips(
                      payslips.map((m) => {
                        if (m.id === p.id) {
                          return { ...m, isNew: undefined };
                        }
                        return m;
                      })
                    );
                  }}
                  onSetAsUnread={() => {
                    setPayslips(
                      payslips.map((m) => {
                        if (m.id === p.id) {
                          return { ...m, isNew: true };
                        }
                        return m;
                      })
                    );
                  }}
                />
              </IonItemGroup>
            ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};
