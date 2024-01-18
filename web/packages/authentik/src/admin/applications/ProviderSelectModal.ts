import { DEFAULT_CONFIG } from "@goauthentik/common/api/config.js";
import { uiConfig } from "@goauthentik/common/ui/config.js";
import "@goauthentik/elements/buttons/SpinnerButton";
import { PaginatedResponse } from "@goauthentik/elements/table/Table.js";
import { TableColumn } from "@goauthentik/elements/table/Table.js";
import { TableModal } from "@goauthentik/elements/table/TableModal.js";

import { msg } from "@lit/localize";
import { TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { Provider, ProvidersApi } from "@goauthentik/api";

@customElement("ak-provider-select-table")
export class ProviderSelectModal extends TableModal<Provider> {
    checkbox = true;
    checkboxChip = true;

    searchEnabled(): boolean {
        return true;
    }

    @property({ type: Boolean })
    backchannelOnly = false;

    @property()
    confirm!: (selectedItems: Provider[]) => Promise<unknown>;

    order = "name";

    async apiEndpoint(page: number): Promise<PaginatedResponse<Provider>> {
        return new ProvidersApi(DEFAULT_CONFIG).providersAllList({
            ordering: this.order,
            page: page,
            pageSize: (await uiConfig()).pagination.perPage,
            search: this.search || "",
            backchannelOnly: this.backchannelOnly,
        });
    }

    columns(): TableColumn[] {
        return [new TableColumn(msg("Name"), "username"), new TableColumn(msg("Type"))];
    }

    row(item: Provider): TemplateResult[] {
        return [
            html`<div>
                <div>${item.name}</div>
            </div>`,
            html`${item.verboseName}`,
        ];
    }

    renderSelectedChip(item: Provider): TemplateResult {
        return html`${item.name}`;
    }

    renderModalInner(): TemplateResult {
        return html`<section class="pf-c-modal-box__header pf-c-page__main-section pf-m-light">
                <div class="pf-c-content">
                    <h1 class="pf-c-title pf-m-2xl">
                        ${msg("Select providers to add to application")}
                    </h1>
                </div>
            </section>
            <section class="pf-c-modal-box__body pf-m-light">${this.renderTable()}</section>
            <footer class="pf-c-modal-box__footer">
                <ak-spinner-button
                    .callAction=${async () => {
                        await this.confirm(this.selectedElements);
                        this.open = false;
                    }}
                    class="pf-m-primary"
                >
                    ${msg("Add")} </ak-spinner-button
                >&nbsp;
                <ak-spinner-button
                    .callAction=${async () => {
                        this.open = false;
                    }}
                    class="pf-m-secondary"
                >
                    ${msg("Cancel")}
                </ak-spinner-button>
            </footer>`;
    }
}
