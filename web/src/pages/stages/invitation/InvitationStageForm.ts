import { InvitationStage, StagesApi } from "authentik-api";
import { t } from "@lingui/macro";
import { customElement } from "lit-element";
import { html, TemplateResult } from "lit-html";
import { DEFAULT_CONFIG } from "../../../api/Config";
import { ifDefined } from "lit-html/directives/if-defined";
import "../../../elements/forms/HorizontalFormElement";
import "../../../elements/forms/FormGroup";
import { first } from "../../../utils";
import { ModelForm } from "../../../elements/forms/ModelForm";

@customElement("ak-stage-invitation-form")
export class InvitationStageForm extends ModelForm<InvitationStage, string> {
    loadInstance(pk: string): Promise<InvitationStage> {
        return new StagesApi(DEFAULT_CONFIG).stagesInvitationStagesRetrieve({
            stageUuid: pk,
        });
    }

    getSuccessMessage(): string {
        if (this.instance) {
            return t`Successfully updated stage.`;
        } else {
            return t`Successfully created stage.`;
        }
    }

    send = (data: InvitationStage): Promise<InvitationStage> => {
        if (this.instance) {
            return new StagesApi(DEFAULT_CONFIG).stagesInvitationStagesUpdate({
                stageUuid: this.instance.pk || "",
                invitationStageRequest: data,
            });
        } else {
            return new StagesApi(DEFAULT_CONFIG).stagesInvitationStagesCreate({
                invitationStageRequest: data,
            });
        }
    };

    renderForm(): TemplateResult {
        return html`<form class="pf-c-form pf-m-horizontal">
            <div class="form-help-text">
                ${t`This stage can be included in enrollment flows to accept invitations.`}
            </div>
            <ak-form-element-horizontal label=${t`Name`} ?required=${true} name="name">
                <input
                    type="text"
                    value="${ifDefined(this.instance?.name || "")}"
                    class="pf-c-form-control"
                    required
                />
            </ak-form-element-horizontal>
            <ak-form-group .expanded=${true}>
                <span slot="header"> ${t`Stage-specific settings`} </span>
                <div slot="body" class="pf-c-form">
                    <ak-form-element-horizontal name="continueFlowWithoutInvitation">
                        <div class="pf-c-check">
                            <input
                                type="checkbox"
                                class="pf-c-check__input"
                                ?checked=${first(
                                    this.instance?.continueFlowWithoutInvitation,
                                    true,
                                )}
                            />
                            <label class="pf-c-check__label">
                                ${t`Continue flow without invitation`}
                            </label>
                        </div>
                        <p class="pf-c-form__helper-text">
                            ${t`If this flag is set, this Stage will jump to the next Stage when no Invitation is given. By default this Stage will cancel the Flow when no invitation is given.`}
                        </p>
                    </ak-form-element-horizontal>
                </div>
            </ak-form-group>
        </form>`;
    }
}
