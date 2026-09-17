import { useLegitimuz, type UseLegitimuzOptions } from "./useLegitimuz";

export function VerificationWidget(props: UseLegitimuzOptions) {
  // A altura é obrigatória: o iframe ocupa 100% da altura do container.
  return <div ref={useLegitimuz(props)} style={{ height: 640 }} />;
}
