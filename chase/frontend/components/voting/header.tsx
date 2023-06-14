import { CountryCode, Voting } from "@/custom_types";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import { faFlag } from "@fortawesome/free-solid-svg-icons/faFlag";
import { faFileContract } from "@fortawesome/free-solid-svg-icons/faFileContract";
import { faGavel } from "@fortawesome/free-solid-svg-icons/faGavel";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons/faInfoCircle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LargeFlag } from "@components/flag_templates";

export default function Header({ title, description, introducedBy, substantiveVote }: Voting) {
    const getFlag = (countryCode: CountryCode = "uno"): CountryCode => {
        return countryCode;
    };

    return (
        <div className="flex flex-row justify-between gap-2 bg-white rounded-md p-3">
            <div className="flex-1 grid gap-3" style={{ gridTemplateColumns: "1fr auto" }}>
                <div className="text-md font-bold col-span-2">{title}</div>
                {introducedBy && (
                    <>
                        <FontAwesomeIcon icon={faFlag} className="text-lg" />
                        <div className="text-sm">Eingebracht von {getCountryNameByCode(introducedBy)}</div>
                    </>
                )}
                {description && (
                    <>
                        <FontAwesomeIcon icon={faInfoCircle} className="text-lg" />
                        <div className="text-sm">{description}</div>
                    </>
                )}
                {substantiveVote ? (
                    <>
                        <FontAwesomeIcon icon={faGavel} className="text-lg" />
                        <div className="text-sm">Prozessuale Abstimmung – keine Enthaltungen möglich</div>
                    </>
                ) : (
                    <>
                        <FontAwesomeIcon icon={faFileContract} className="text-xl" />
                        <div className="text-sm">Inhaltliche Abstimmung – Enthaltungen sind möglich</div>
                    </>
                )}
            </div>
            <div className="flex flex-col justify-start items-center">
                <LargeFlag countryCode={getFlag(introducedBy)} />
            </div>
        </div>
    );
}