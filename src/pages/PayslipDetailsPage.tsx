import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  IonToolbar,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";
import { download, mailOpen } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { IPayslip, payslipAtom } from "../atoms/payslipAtom";
import { useAtom } from "jotai";
import { Share } from "@capacitor/share";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";
import { dateFormat } from "../helper/dateFormatter";

export const PayslipDetailsPage: React.FC = () => {
  const [payslip, setPayslip] = useState<IPayslip>();
  const [canShare, setCanShare] = useState(false);
  const [payslipList, setPayslipList] = useAtom(payslipAtom);
  const params = useParams<{ id: string }>();
  const { goBack } = useIonRouter();

  // This is fired when the component routing to is about to animate into view (fired by outlet).
  useIonViewWillEnter(() => {
    const foundPayslip = payslipList.find(
      (p) => p.id === parseInt(params.id, 10)
    );

    setPayslip(foundPayslip);
  });

  useEffect(() => {
    async function checkCanShare() {
      const share = await Share.canShare();
      setCanShare(share.value);
    }
    checkCanShare();
  }, []);

  return (
    <Page>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons>
            <IonBackButton defaultHref="/home"></IonBackButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                setPayslipList(
                  payslipList.map((m) => {
                    if (m.id === parseInt(params.id, 10)) {
                      return { ...m, isNew: true };
                    }
                    return m;
                  })
                );
                goBack();
              }}
            >
              Mark as unread
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {payslip ? (
          <>
            <IonItem>
              <IonIcon
                aria-hidden="true"
                icon={mailOpen}
                color="primary"
              ></IonIcon>
              <IonLabel className="ion-text-wrap">
                <h2>
                  Payment for {dateFormat(payslip.fromDate, "YYYY-MM-DD")}
                  <span className="date">
                    <IonNote>
                      {`${dateFormat(payslip.fromDate, "DD")} -
                        ${dateFormat(payslip.fromDate, "DD MMM")}`}
                    </IonNote>
                  </span>
                </h2>
              </IonLabel>
            </IonItem>

            <div className="ion-padding imageContainer">
              <img src={payslip.file} alt="payslip" />

              {canShare && (
                <IonButton
                  onClick={async () => {
                    // if NativePLatform is web then we can download the file
                    if (Capacitor.getPlatform() === "web") {
                      await Share.share({
                        url: payslip.file!,
                      });
                    } else {
                      // if not, we need to download the file and then share it
                      var result = await Filesystem.downloadFile({
                        path: payslip.file!,
                        directory: Directory.Library,
                        url: payslip.file!,
                      });
                      await Share.share({
                        url: result.path,
                      });
                      console.log("Downloaded file", result);
                    }
                  }}
                >
                  <IonIcon slot="start" icon={download}></IonIcon>
                  Download
                </IonButton>
              )}
            </div>
          </>
        ) : (
          <div>Payslip not found</div>
        )}
      </IonContent>
    </Page>
  );
};

const Page = styled(IonPage)`
  ion-item {
    --inner-padding-end: 0;
    --background: transparent;
  }
  ion-label {
    margin-top: 12px;
    margin-bottom: 12px;
  }

  ion-item h2 {
    font-weight: 600;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  ion-item .date {
    align-items: center;
    display: flex;
  }

  ion-item ion-icon {
    font-size: 42px;
    margin-right: 8px;
  }

  ion-item ion-note {
    font-size: 0.9375rem;
    margin-right: 12px;
    font-weight: normal;
  }
  h1 {
    margin: 0;
    font-weight: bold;
    font-size: 1.4rem;
  }
  p {
    line-height: 1.4;
  }

  .imageContainer {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    align-items: center;
    justify-content: center;
    img {
      width: 50%;

      height: 50%;
      object-fit: contain;
      flex: 0.5;
      margin-bottom: 3rem;
    }
  }
`;
