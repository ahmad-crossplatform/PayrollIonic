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
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { IPayslip, payslipAtom } from "../atoms/payslipAtom";
import { useAtom } from "jotai";
import { Share } from "@capacitor/share";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";

export const PayslipDetailsPage: React.FC = () => {
  const [payslip, setPayslip] = useState<IPayslip>();
  const [canShare, setCanShare] = useState(false);
  const [payslipList, setPayslipList] = useAtom(payslipAtom);
  const params = useParams<{ id: string }>();
  const { goBack } = useIonRouter();

  const convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  async function downloadAndSaveImage(imageUrl: string, fileName: string) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const base64Data = await convertBlobToBase64(blob);

      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data as string,
        directory: Directory.Data,
      });

      console.log("Image saved", savedFile);
    } catch (e) {
      console.error("Error saving image", e);
    }
  }
  // This is fired when the component routing to is about to animate into view (fired by outlet).
  useIonViewWillEnter(() => {
    const foundPayslip = payslipList.find(
      (p) => p.id === parseInt(params.id, 10)
    );

    setPayslip(foundPayslip);
  });

  useEffect(() => {
    // Share is not available in the web, so we need to check if it's available
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
                  Payment for {moment(payslip.fromDate).format("YYYY-MM-DD")}
                  <span className="date">
                    <IonNote>
                      {`${moment(payslip.fromDate).format("DD")} -
                        ${moment(payslip.toDate).format("DD MMM")}`}
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
