import { defineComponent, withAsyncContext, computed, ref, reactive, watch, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, isRef, createCommentVNode, Fragment, Transition, renderList, withDirectives, vModelText, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { B as BaseAlert } from './BaseAlert-BEu0SLA6.mjs';
import { m as useAuthStore, r as useRouter, n as navigateTo, q as useRoute, a as BaseButton, j as getApiErrorMessage, k as normalizeApiList } from './server.mjs';
import { B as BaseInput } from './BaseInput-BGy7Y2Dg.mjs';
import { B as BaseSelect } from './BaseSelect-BfVIRUJz.mjs';
import { B as BaseTable } from './BaseTable-CqvfAMbq.mjs';
import { B as BaseTextarea } from './BaseTextarea-C3eZlfXs.mjs';
import { D as DashboardEmptyState } from './DashboardEmptyState-h4BGOSgm.mjs';
import { D as DashboardPageHeader } from './DashboardPageHeader-C891xTIs.mjs';
import { R as RoleDashboardFrame, D as DashboardSection } from './RoleDashboardFrame-z5_-ER2G.mjs';
import { f as fetchCalculatorConfig, a as fetchCalculatorPreview } from './calculator-Bvr693iI.mjs';
import { u as useDashboardApi } from './dashboard-CEbEdesF.mjs';
import { s as searchPartnerClients, b as getPartnerQuotes, g as getPartnerQuoteDetail, p as previewPartnerQuote, c as createPartnerClient, a as createPartnerQuote, e as sendPartnerQuoteToClient } from './partner-CVYG73qe.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import '@vue/shared';
import './design-HtHvYN8j.mjs';
import './DashboardTopbar-CBNaUx0B.mjs';
import './PrintyLogo-bSA8QTQF.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[section]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const auth = useAuthStore();
    useRouter();
    const { fetchDashboardSection } = useDashboardApi();
    if (!auth.canAccessPartnerDashboard) {
      [__temp, __restore] = withAsyncContext(() => navigateTo(auth.homeRoute)), await __temp, __restore();
    }
    const route = useRoute();
    const section = computed(() => String(route.params.section || "quotes"));
    const displayName = computed(() => auth.user?.name || auth.user?.email || "Partner");
    const initials = computed(() => displayName.value.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "PT");
    const loading = ref(true);
    const quotesLoading = ref(true);
    const pageError = ref("");
    const toastMessage = ref("");
    const payload = ref(null);
    const rows = ref([]);
    const quoteRows = ref([]);
    const quotePanelOpen = ref(false);
    const quotePanelStep = ref(1);
    const panelError = ref("");
    const config = ref(null);
    const previewLoading = ref(false);
    const sendLoading = ref(false);
    const clientCreateLoading = ref(false);
    const previewData = ref(null);
    const rawPricingPreview = ref(null);
    const selectedPreviewShop = ref(null);
    const previewWarning = ref("");
    const clientSearchQuery = ref("");
    const clientSearchResults = ref([]);
    const selectedClient = ref(null);
    const showNewClientForm = ref(false);
    const searchLoading = ref(false);
    const markupRate = ref("30");
    const newClientForm = reactive({
      name: "",
      phone: "",
      email: "",
      company: ""
    });
    const quoteSpecs = reactive({
      product_type: "business_card",
      finished_size: "",
      quantity: "100",
      paper_stock: "",
      print_sides: "SIMPLEX",
      color_mode: "COLOR",
      lamination: "none",
      urgency_type: "standard",
      note: ""
    });
    let searchTimer = null;
    const quoteColumns = [
      { key: "client", label: "Client" },
      { key: "product", label: "Product" },
      { key: "client_pays", label: "Client pays" },
      { key: "your_margin", label: "Your margin" },
      { key: "status", label: "Status" },
      { key: "date", label: "Date" }
    ];
    const quoteStepPills = [
      { value: 1, label: "1. Client" },
      { value: 2, label: "2. Specs + Price" },
      { value: 3, label: "3. Review + Send" }
    ];
    const sectionTitleMap = {
      jobs: "Partner Jobs",
      clients: "Partner Clients",
      "production-shops": "Production Shops",
      payments: "Partner Payments",
      markups: "Markups",
      samples: "Samples",
      settings: "Settings"
    };
    const sectionTitle = computed(() => sectionTitleMap[section.value] || "Partner Section");
    const isUiOnly = computed(() => !payload.value);
    const emptyText = computed(() => isUiOnly.value ? "This section is UI-only right now." : `No ${section.value} yet.`);
    const columns = computed(() => {
      if (section.value === "clients") return [{ key: "name", label: "Client" }];
      if (section.value === "production-shops") return [{ key: "name", label: "Shop" }, { key: "slug", label: "Slug" }];
      if (section.value === "payments") return [{ key: "reference", label: "Reference" }, { key: "partner_commission", label: "Partner Commission" }, { key: "status", label: "Status" }];
      return [{ key: "reference", label: "Reference" }, { key: "status", label: "Status" }, { key: "client_name", label: "Client" }];
    });
    const navItems = computed(() => [
      { label: "Overview", to: "/dashboard/partner" },
      { label: "Quotes", to: "/dashboard/partner/quotes", active: section.value === "quotes" },
      { label: "Jobs", to: "/dashboard/partner/jobs", active: section.value === "jobs" },
      { label: "Clients", to: "/dashboard/partner/clients", active: section.value === "clients" },
      { label: "Shops", to: "/dashboard/partner/production-shops", active: section.value === "production-shops" },
      { label: "Rate Card", to: "/dashboard/partner/rate-card" },
      { label: "Messages", to: "/dashboard/partner/messages" }
    ]);
    const productTypeOptions = computed(() => (config.value?.products || config.value?.product_types || []).map((item) => ({
      label: item.label,
      value: item.key
    })));
    const selectedProduct = computed(() => (config.value?.products || config.value?.product_types || []).find((item) => item.key === quoteSpecs.product_type) || null);
    const sizeOptions = computed(() => (selectedProduct.value?.size_options || selectedProduct.value?.sizes || []).map((item) => ({
      label: item.label,
      value: item.id || item.value
    })));
    const paperOptions = computed(() => (selectedProduct.value?.paper_stocks || selectedProduct.value?.paper_options || config.value?.paper_stocks || []).map((item) => ({
      label: item.label || item.display_name || item.paper_name,
      value: item.key || item.id || item.value
    })));
    const colorModeOptions = computed(() => (selectedProduct.value?.color_mode_options || config.value?.color_modes || [
      { label: "Full color", value: "COLOR" },
      { label: "Black & white", value: "BW" }
    ]).map((item) => ({
      label: item.label,
      value: item.value
    })));
    const sideOptions = [
      { label: "Single-sided", value: "SIMPLEX" },
      { label: "Double-sided", value: "DUPLEX" }
    ];
    const finishingOptions = [
      { label: "None", value: "none" },
      { label: "Matt lamination", value: "matt-lamination" },
      { label: "Gloss lamination", value: "gloss-lamination" }
    ];
    const turnaroundOptions = [
      { label: "Standard", value: "standard" },
      { label: "Express", value: "express" },
      { label: "Same day", value: "same_day" }
    ];
    const productionBase = computed(() => Number(previewData.value?.production_estimate || 0));
    const platformFeePercent = computed(() => Number(previewData.value?.platform_service_percent || 30));
    const markupRateNumber = computed(() => Math.max(0, Number(markupRate.value || 0)));
    const markupAmount = computed(() => roundMoney(productionBase.value * markupRateNumber.value / 100));
    const platformFeeAmount = computed(() => roundMoney(productionBase.value * platformFeePercent.value / 100));
    const clientTotalAmount = computed(() => roundMoney(productionBase.value + markupAmount.value + platformFeeAmount.value));
    const selectedPreviewShopLabel = computed(() => selectedPreviewShop.value?.name || selectedPreviewShop.value?.slug || "");
    const hasNewClientDraft = computed(() => showNewClientForm.value && Boolean(newClientForm.name.trim() && newClientForm.phone.trim()));
    const canContinueStepOne = computed(() => Boolean(selectedClient.value?.client_id || selectedClient.value?.id || hasNewClientDraft.value));
    const canSendQuote = computed(() => Boolean(selectedClient.value?.id && previewData.value && selectedPreviewShop.value?.id));
    const reviewClientLabel = computed(() => {
      if (selectedClient.value) {
        return `${selectedClient.value.name || "Client"} · ${selectedClient.value.phone || selectedClient.value.email || `Client #${selectedClient.value.id}`}`;
      }
      return "No client selected";
    });
    const reviewJobLabel = computed(() => {
      const productLabel = productTypeOptions.value.find((option) => option.value === quoteSpecs.product_type)?.label || quoteSpecs.product_type;
      const sizeLabel = sizeOptions.value.find((option) => option.value === quoteSpecs.finished_size)?.label || quoteSpecs.finished_size;
      return `${productLabel} · ${quoteSpecs.quantity} qty · ${sizeLabel}`;
    });
    const reviewSpecsLabel = computed(() => {
      const paperLabel = paperOptions.value.find((option) => option.value === quoteSpecs.paper_stock)?.label || quoteSpecs.paper_stock;
      const colorLabel = colorModeOptions.value.find((option) => option.value === quoteSpecs.color_mode)?.label || quoteSpecs.color_mode;
      const finishingLabel = finishingOptions.find((option) => option.value === quoteSpecs.lamination)?.label || "None";
      return `${quoteSpecs.print_sides === "DUPLEX" ? "Double-sided" : "Single-sided"} · ${colorLabel} · ${paperLabel} · ${finishingLabel}`;
    });
    function roundMoney(value) {
      return Number(Number(value || 0).toFixed(2));
    }
    function formatMoney(value) {
      const amount = Number(value || 0);
      if (!Number.isFinite(amount) || amount <= 0) {
        return "KES 0.00";
      }
      return `KES ${amount.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    function productSummary(row) {
      const latestSnapshot = row.detail?.latest_response?.response_snapshot || {};
      const requestSnapshot = row.detail?.request_snapshot || row.detail?.latest_response?.quote_request?.request_snapshot || {};
      return latestSnapshot.product_label || requestSnapshot.product_label || requestSnapshot.product_type || row.reference || "Quote";
    }
    function derivePartnerStatus(detail, listRow) {
      const job = detail?.managed_job || null;
      const paymentStatus = String(job?.payment_status || "").toLowerCase();
      const assignmentStatus = String(job?.assignment_status || "").toLowerCase();
      const jobStatus = String(job?.status || "").toLowerCase();
      if (["completed", "delivered"].includes(jobStatus)) return "complete";
      if (job?.dispatched_at || assignmentStatus === "assignment_pending" || assignmentStatus === "assigned" || assignmentStatus === "accepted") return "dispatched";
      if (["confirmed", "release_ready", "paid"].includes(paymentStatus)) return "paid";
      if (job?.id) return "accepted";
      return String(listRow.status || "draft").toLowerCase();
    }
    function statusBadgeClass(status) {
      const value = String(status || "").toLowerCase();
      if (value === "sent") return "bg-amber-50 text-amber-700";
      if (value === "accepted") return "bg-green-50 text-green-700";
      if (value === "paid") return "bg-green-100 text-green-800";
      if (value === "dispatched") return "bg-blue-50 text-blue-700";
      if (value === "complete") return "bg-teal-50 text-teal-700";
      return "bg-slate-100 text-slate-600";
    }
    function partnerStatusLabel(status) {
      return String(status || "draft").replace(/[_-]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    }
    function openQuoteDetail(row) {
      navigateTo(`/dashboard/partner/quotes/${row.quote_request_id || row.id}`);
    }
    function openQuotePanel() {
      toastMessage.value = "";
      panelError.value = "";
      quotePanelOpen.value = true;
      quotePanelStep.value = 1;
    }
    function closeQuotePanel() {
      quotePanelOpen.value = false;
      quotePanelStep.value = 1;
      panelError.value = "";
      selectedClient.value = null;
      showNewClientForm.value = false;
      previewData.value = null;
      rawPricingPreview.value = null;
      selectedPreviewShop.value = null;
      markupRate.value = "30";
      Object.assign(newClientForm, {
        name: "",
        phone: "",
        email: "",
        company: ""
      });
    }
    function goToStep(step) {
      if (step <= quotePanelStep.value || step === 2 && canContinueStepOne.value || step === 3 && previewData.value) {
        quotePanelStep.value = step;
      }
    }
    function selectClient(client) {
      selectedClient.value = {
        ...client,
        id: client.client_id || client.id,
        client_id: client.client_id || client.id
      };
      showNewClientForm.value = false;
      panelError.value = "";
    }
    async function continueFromClientStep() {
      panelError.value = "";
      if (selectedClient.value?.id) {
        quotePanelStep.value = 2;
        return;
      }
      if (!hasNewClientDraft.value) {
        panelError.value = "Select an existing client or enter a new client name and phone.";
        return;
      }
      clientCreateLoading.value = true;
      try {
        const createdClient = await createPartnerClient({
          name: newClientForm.name.trim(),
          phone: newClientForm.phone.trim(),
          email: newClientForm.email.trim(),
          company: newClientForm.company.trim()
        });
        selectClient(createdClient);
        clientSearchResults.value = await searchPartnerClients("");
        quotePanelStep.value = 2;
      } catch (error) {
        panelError.value = getApiErrorMessage(error, "We could not create this client yet.");
      } finally {
        clientCreateLoading.value = false;
      }
    }
    function applySpecDefaults() {
      if (!quoteSpecs.finished_size && sizeOptions.value[0]) {
        quoteSpecs.finished_size = String(sizeOptions.value[0].value);
      }
      if (!quoteSpecs.paper_stock && paperOptions.value[0]) {
        quoteSpecs.paper_stock = String(paperOptions.value[0].value);
      }
    }
    async function loadQuotesSection() {
      quotesLoading.value = true;
      pageError.value = "";
      try {
        const list = await getPartnerQuotes();
        const detailedRows = await Promise.all(list.map(async (row) => {
          const detailPayload = await getPartnerQuoteDetail(row.quote_request_id);
          const detail = detailPayload?.quote || null;
          const pricing = detail?.latest_response?.response_snapshot?.customer_pricing || {};
          const derivedStatus = derivePartnerStatus(detail, row);
          return {
            id: row.id,
            quote_request_id: row.quote_request_id,
            client: row.client_name || detail?.client_name || "Client",
            product: productSummary({ ...row, detail }),
            client_pays: formatMoney(pricing.final_client_price || pricing.estimated_total || detail?.managed_job?.pricing?.client_total || 0),
            your_margin: formatMoney(pricing.broker_margin_amount || 0),
            status: derivedStatus,
            date: formatDate(row.created_at || detail?.created_at)
          };
        }));
        quoteRows.value = detailedRows;
      } catch (error) {
        pageError.value = getApiErrorMessage(error, "Partner quotes are unavailable right now.");
      } finally {
        quotesLoading.value = false;
        loading.value = false;
      }
    }
    async function loadGenericSection() {
      loading.value = true;
      pageError.value = "";
      try {
        payload.value = await fetchDashboardSection("partner", section.value);
        rows.value = normalizeApiList(payload.value?.results || []);
      } catch (error) {
        pageError.value = getApiErrorMessage(error, "Partner dashboard section is unavailable right now.");
      } finally {
        loading.value = false;
      }
    }
    async function loadCalculatorConfig() {
      if (config.value) {
        return;
      }
      config.value = await fetchCalculatorConfig();
      applySpecDefaults();
    }
    async function loadProductionPreview() {
      panelError.value = "";
      previewWarning.value = "";
      try {
        previewLoading.value = true;
        await loadCalculatorConfig();
        const pricingSnapshot = await fetchCalculatorPreview({
          product_type: quoteSpecs.product_type,
          quantity: Number(quoteSpecs.quantity || 0),
          finished_size: quoteSpecs.finished_size,
          print_sides: quoteSpecs.print_sides,
          color_mode: quoteSpecs.color_mode,
          paper_stock: quoteSpecs.paper_stock,
          lamination: quoteSpecs.lamination,
          urgency_type: quoteSpecs.urgency_type,
          custom_brief: quoteSpecs.note
        });
        rawPricingPreview.value = pricingSnapshot;
        selectedPreviewShop.value = Array.isArray(pricingSnapshot?.selected_shops) ? pricingSnapshot.selected_shops[0] : null;
        if (!selectedPreviewShop.value?.id) {
          previewWarning.value = "The production preview did not return a selectable shop.";
          previewData.value = null;
          return;
        }
        const initialMarkupAmount = roundMoney(Number(pricingSnapshot?.selected_shops?.[0]?.preview?.totals?.subtotal || pricingSnapshot?.totals?.subtotal || 0) * markupRateNumber.value / 100);
        previewData.value = await previewPartnerQuote({
          shop: selectedPreviewShop.value.id,
          pricing_snapshot: pricingSnapshot,
          partner_markup: initialMarkupAmount.toFixed(2)
        });
        quotePanelStep.value = 2;
      } catch (error) {
        panelError.value = getApiErrorMessage(error, "We could not fetch the production preview.");
      } finally {
        previewLoading.value = false;
      }
    }
    async function submitPartnerQuote() {
      if (!selectedClient.value?.id || !selectedPreviewShop.value?.id || !rawPricingPreview.value) {
        panelError.value = "Select a client and load the production preview before sending.";
        return;
      }
      panelError.value = "";
      sendLoading.value = true;
      try {
        const createPayload = await createPartnerQuote({
          shop: selectedPreviewShop.value.id,
          title: `${reviewJobLabel.value} for ${selectedClient.value.name || "client"}`,
          client_id: selectedClient.value.id,
          client_name: selectedClient.value.name || "",
          client_email: selectedClient.value.email || "",
          client_phone: selectedClient.value.phone || "",
          calculator_inputs_snapshot: {
            product_type: quoteSpecs.product_type,
            quantity: Number(quoteSpecs.quantity || 0),
            finished_size: quoteSpecs.finished_size,
            paper_stock: quoteSpecs.paper_stock,
            print_sides: quoteSpecs.print_sides,
            color_mode: quoteSpecs.color_mode,
            lamination: quoteSpecs.lamination,
            urgency_type: quoteSpecs.urgency_type
          },
          pricing_snapshot: rawPricingPreview.value,
          partner_markup: markupAmount.value.toFixed(2),
          note: quoteSpecs.note
        });
        await sendPartnerQuoteToClient(createPayload.quote_request_id, {
          broker_margin_type: "percent",
          broker_margin_value: markupRateNumber.value.toFixed(2),
          platform_service_percent: platformFeePercent.value.toFixed(2)
        });
        toastMessage.value = `Quote sent to ${selectedClient.value.name || "client"}`;
        closeQuotePanel();
        await loadQuotesSection();
      } catch (error) {
        panelError.value = getApiErrorMessage(error, "We could not send this partner quote.");
      } finally {
        sendLoading.value = false;
      }
    }
    function formatDate(value) {
      if (!value) {
        return "Recent";
      }
      const date = new Date(String(value));
      if (Number.isNaN(date.getTime())) {
        return "Recent";
      }
      return new Intl.DateTimeFormat("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }).format(date);
    }
    watch(selectedProduct, () => {
      applySpecDefaults();
    });
    watch(clientSearchQuery, (value) => {
      if (searchTimer) {
        clearTimeout(searchTimer);
      }
      searchTimer = setTimeout(async () => {
        searchLoading.value = true;
        try {
          clientSearchResults.value = await searchPartnerClients(value);
        } finally {
          searchLoading.value = false;
        }
      }, 400);
    });
    if (section.value === "quotes") {
      [__temp, __restore] = withAsyncContext(() => loadCalculatorConfig()), await __temp, __restore();
      [__temp, __restore] = withAsyncContext(() => loadQuotesSection()), await __temp, __restore();
      clientSearchResults.value = ([__temp, __restore] = withAsyncContext(() => searchPartnerClients("")), __temp = await __temp, __restore(), __temp);
    } else {
      [__temp, __restore] = withAsyncContext(() => loadGenericSection()), await __temp, __restore();
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(RoleDashboardFrame, mergeProps({
        title: "Partner Workspace",
        badge: "Partner",
        name: unref(displayName),
        initials: unref(initials),
        subtitle: "Role-specific partner flows",
        "breadcrumb-root": "Dashboard",
        "nav-items": unref(navItems),
        "support-title": "Partner workspace",
        "support-copy": "Partner quote, client, and production-shop flows stay separate from client and production routes.",
        "support-action": "Overview",
        "support-to": "/dashboard/partner",
        onLogout: ($event) => unref(auth).logout()
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(pageError)) {
              _push2(ssrRenderComponent(BaseAlert, {
                variant: "error",
                title: "Partner workspace could not load.",
                message: unref(pageError)
              }, null, _parent2, _scopeId));
            } else if (unref(toastMessage)) {
              _push2(ssrRenderComponent(BaseAlert, {
                class: "mb-6",
                variant: "success",
                message: unref(toastMessage)
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (unref(section) === "quotes") {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(DashboardPageHeader, {
                eyebrow: "Partner Quotes",
                title: "Quotes",
                subtitle: "Create client-facing quotes from production pricing and track the full brokered workflow."
              }, {
                actions: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(BaseButton, {
                      variant: "primary",
                      size: "md",
                      onClick: openQuotePanel
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`New quote`);
                        } else {
                          return [
                            createTextVNode("New quote")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(BaseButton, {
                        variant: "primary",
                        size: "md",
                        onClick: openQuotePanel
                      }, {
                        default: withCtx(() => [
                          createTextVNode("New quote")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(DashboardSection, {
                title: "Quotes",
                subtitle: "Client | Product | Client pays | Your margin | Status | Date"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (!unref(quotesLoading) && !unref(quoteRows).length) {
                      _push3(ssrRenderComponent(DashboardEmptyState, {
                        title: "No quotes yet. Create your first quote for a client.",
                        "action-label": "New quote",
                        onClick: openQuotePanel
                      }, {
                        action: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(BaseButton, {
                              variant: "secondary",
                              size: "sm",
                              onClick: openQuotePanel
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`New quote`);
                                } else {
                                  return [
                                    createTextVNode("New quote")
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(BaseButton, {
                                variant: "secondary",
                                size: "sm",
                                onClick: openQuotePanel
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("New quote")
                                ]),
                                _: 1
                              })
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(ssrRenderComponent(BaseTable, {
                        columns: quoteColumns,
                        rows: unref(quoteRows),
                        loading: unref(quotesLoading),
                        "empty-text": "No quotes yet. Create your first quote for a client.",
                        variant: "dashboard",
                        "row-action": openQuoteDetail
                      }, {
                        "cell-status": withCtx(({ value }, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<span class="${ssrRenderClass([statusBadgeClass(value), "inline-flex rounded-full px-3 py-1 text-xs font-semibold"])}"${_scopeId3}>${ssrInterpolate(partnerStatusLabel(value))}</span>`);
                          } else {
                            return [
                              createVNode("span", {
                                class: ["inline-flex rounded-full px-3 py-1 text-xs font-semibold", statusBadgeClass(value)]
                              }, toDisplayString(partnerStatusLabel(value)), 3)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    }
                  } else {
                    return [
                      !unref(quotesLoading) && !unref(quoteRows).length ? (openBlock(), createBlock(DashboardEmptyState, {
                        key: 0,
                        title: "No quotes yet. Create your first quote for a client.",
                        "action-label": "New quote",
                        onClick: openQuotePanel
                      }, {
                        action: withCtx(() => [
                          createVNode(BaseButton, {
                            variant: "secondary",
                            size: "sm",
                            onClick: openQuotePanel
                          }, {
                            default: withCtx(() => [
                              createTextVNode("New quote")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })) : (openBlock(), createBlock(BaseTable, {
                        key: 1,
                        columns: quoteColumns,
                        rows: unref(quoteRows),
                        loading: unref(quotesLoading),
                        "empty-text": "No quotes yet. Create your first quote for a client.",
                        variant: "dashboard",
                        "row-action": openQuoteDetail
                      }, {
                        "cell-status": withCtx(({ value }) => [
                          createVNode("span", {
                            class: ["inline-flex rounded-full px-3 py-1 text-xs font-semibold", statusBadgeClass(value)]
                          }, toDisplayString(partnerStatusLabel(value)), 3)
                        ]),
                        _: 1
                      }, 8, ["rows", "loading"]))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (unref(quotePanelOpen)) {
                _push2(`<button type="button" class="fixed inset-0 z-40 bg-slate-950/35" aria-label="Close new quote panel"${_scopeId}></button>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(quotePanelOpen)) {
                _push2(`<aside class="fixed right-0 top-0 z-50 flex h-screen w-full max-w-4xl flex-col overflow-hidden border-l border-slate-200 bg-white shadow-2xl"${_scopeId}><div class="flex items-center justify-between border-b border-slate-200 px-6 py-5"${_scopeId}><div${_scopeId}><p class="text-sm font-medium text-slate-400"${_scopeId}>Partner Quote Builder</p><h2 class="text-xl font-bold text-slate-900"${_scopeId}>New quote</h2></div><button type="button" class="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600"${_scopeId}> X </button></div><div class="border-b border-slate-200 px-6 py-4"${_scopeId}><div class="flex flex-wrap gap-2"${_scopeId}><!--[-->`);
                ssrRenderList(quoteStepPills, (pill) => {
                  _push2(`<button type="button" class="${ssrRenderClass([unref(quotePanelStep) === pill.value ? "bg-[#101828] text-white" : "bg-slate-100 text-slate-500", "rounded-full px-4 py-2 text-sm font-semibold transition-colors"])}"${_scopeId}>${ssrInterpolate(pill.label)}</button>`);
                });
                _push2(`<!--]--></div></div><div class="flex-1 overflow-y-auto px-6 py-6"${_scopeId}>`);
                if (unref(panelError)) {
                  _push2(ssrRenderComponent(BaseAlert, {
                    class: "mb-5",
                    variant: "error",
                    message: unref(panelError)
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                if (unref(quotePanelStep) === 1) {
                  _push2(`<div class="space-y-6"${_scopeId}><div${_scopeId}><h3 class="text-lg font-semibold text-slate-900"${_scopeId}>Step 1 - Select client</h3><p class="mt-1 text-sm text-slate-500"${_scopeId}>Pick an existing client account for this brokered quote.</p></div><div class="rounded-2xl border border-slate-200 bg-slate-50 p-5"${_scopeId}>`);
                  _push2(ssrRenderComponent(BaseInput, {
                    modelValue: unref(clientSearchQuery),
                    "onUpdate:modelValue": ($event) => isRef(clientSearchQuery) ? clientSearchQuery.value = $event : null,
                    label: "Search by name or phone",
                    placeholder: "Search by name or phone",
                    variant: "dashboard"
                  }, null, _parent2, _scopeId));
                  if (unref(clientSearchResults).length) {
                    _push2(`<div class="mt-3 rounded-2xl border border-slate-200 bg-white"${_scopeId}><!--[-->`);
                    ssrRenderList(unref(clientSearchResults), (client) => {
                      _push2(`<button type="button" class="flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50"${_scopeId}><span class="font-semibold text-slate-800"${_scopeId}>${ssrInterpolate(client.name || "Client")}</span><span class="text-sm text-slate-500"${_scopeId}>${ssrInterpolate(client.phone || client.email || `Client #${client.id}`)}</span></button>`);
                    });
                    _push2(`<!--]--></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (unref(selectedClient)) {
                    _push2(`<div class="mt-4 flex flex-wrap items-center gap-3"${_scopeId}><span class="inline-flex items-center gap-2 rounded-full bg-[#fef3f2] px-4 py-2 text-sm font-semibold text-[#b42318]"${_scopeId}>${ssrInterpolate(unref(selectedClient).name || "Client")} · ${ssrInterpolate(unref(selectedClient).phone || unref(selectedClient).email || `Client #${unref(selectedClient).id}`)}</span><button type="button" class="text-sm font-semibold text-slate-500"${_scopeId}> Remove </button></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div><div class="rounded-2xl border border-dashed border-slate-300 p-5"${_scopeId}><button type="button" class="text-sm font-semibold text-[#e13515]"${_scopeId}> + New client </button>`);
                  if (unref(showNewClientForm)) {
                    _push2(`<div class="mt-4 grid gap-4 md:grid-cols-2"${_scopeId}>`);
                    _push2(ssrRenderComponent(BaseInput, {
                      modelValue: unref(newClientForm).name,
                      "onUpdate:modelValue": ($event) => unref(newClientForm).name = $event,
                      label: "Name",
                      variant: "dashboard"
                    }, null, _parent2, _scopeId));
                    _push2(ssrRenderComponent(BaseInput, {
                      modelValue: unref(newClientForm).phone,
                      "onUpdate:modelValue": ($event) => unref(newClientForm).phone = $event,
                      label: "Phone",
                      variant: "dashboard"
                    }, null, _parent2, _scopeId));
                    _push2(ssrRenderComponent(BaseInput, {
                      modelValue: unref(newClientForm).email,
                      "onUpdate:modelValue": ($event) => unref(newClientForm).email = $event,
                      label: "Email",
                      variant: "dashboard"
                    }, null, _parent2, _scopeId));
                    _push2(ssrRenderComponent(BaseInput, {
                      modelValue: unref(newClientForm).company,
                      "onUpdate:modelValue": ($event) => unref(newClientForm).company = $event,
                      label: "Company",
                      variant: "dashboard"
                    }, null, _parent2, _scopeId));
                    _push2(`</div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (unref(showNewClientForm)) {
                    _push2(`<p class="mt-3 text-sm text-slate-500"${_scopeId}> Continue will create or link a client account for this partner, select it, and move to pricing. </p>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div></div>`);
                } else if (unref(quotePanelStep) === 2) {
                  _push2(`<div class="space-y-6"${_scopeId}><div${_scopeId}><h3 class="text-lg font-semibold text-slate-900"${_scopeId}>Step 2 - Job specs + price preview</h3><p class="mt-1 text-sm text-slate-500"${_scopeId}>Fetch production pricing, then adjust your markup locally.</p></div><div class="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]"${_scopeId}><div class="space-y-4"${_scopeId}>`);
                  _push2(ssrRenderComponent(BaseSelect, {
                    modelValue: unref(quoteSpecs).product_type,
                    "onUpdate:modelValue": ($event) => unref(quoteSpecs).product_type = $event,
                    label: "Product type",
                    options: unref(productTypeOptions),
                    variant: "dashboard"
                  }, null, _parent2, _scopeId));
                  _push2(ssrRenderComponent(BaseSelect, {
                    modelValue: unref(quoteSpecs).finished_size,
                    "onUpdate:modelValue": ($event) => unref(quoteSpecs).finished_size = $event,
                    label: "Size",
                    options: unref(sizeOptions),
                    variant: "dashboard"
                  }, null, _parent2, _scopeId));
                  _push2(ssrRenderComponent(BaseInput, {
                    modelValue: unref(quoteSpecs).quantity,
                    "onUpdate:modelValue": ($event) => unref(quoteSpecs).quantity = $event,
                    type: "number",
                    min: "1",
                    label: "Quantity",
                    variant: "dashboard"
                  }, null, _parent2, _scopeId));
                  _push2(ssrRenderComponent(BaseSelect, {
                    modelValue: unref(quoteSpecs).paper_stock,
                    "onUpdate:modelValue": ($event) => unref(quoteSpecs).paper_stock = $event,
                    label: "Paper",
                    options: unref(paperOptions),
                    variant: "dashboard"
                  }, null, _parent2, _scopeId));
                  _push2(ssrRenderComponent(BaseSelect, {
                    modelValue: unref(quoteSpecs).print_sides,
                    "onUpdate:modelValue": ($event) => unref(quoteSpecs).print_sides = $event,
                    label: "Sides",
                    options: sideOptions,
                    variant: "dashboard"
                  }, null, _parent2, _scopeId));
                  _push2(ssrRenderComponent(BaseSelect, {
                    modelValue: unref(quoteSpecs).color_mode,
                    "onUpdate:modelValue": ($event) => unref(quoteSpecs).color_mode = $event,
                    label: "Colour mode",
                    options: unref(colorModeOptions),
                    variant: "dashboard"
                  }, null, _parent2, _scopeId));
                  _push2(ssrRenderComponent(BaseSelect, {
                    modelValue: unref(quoteSpecs).lamination,
                    "onUpdate:modelValue": ($event) => unref(quoteSpecs).lamination = $event,
                    label: "Finishing",
                    options: finishingOptions,
                    variant: "dashboard"
                  }, null, _parent2, _scopeId));
                  _push2(ssrRenderComponent(BaseSelect, {
                    modelValue: unref(quoteSpecs).urgency_type,
                    "onUpdate:modelValue": ($event) => unref(quoteSpecs).urgency_type = $event,
                    label: "Turnaround",
                    options: turnaroundOptions,
                    variant: "dashboard"
                  }, null, _parent2, _scopeId));
                  _push2(ssrRenderComponent(BaseTextarea, {
                    modelValue: unref(quoteSpecs).note,
                    "onUpdate:modelValue": ($event) => unref(quoteSpecs).note = $event,
                    label: "Notes",
                    placeholder: "Optional client-facing note",
                    variant: "dashboard"
                  }, null, _parent2, _scopeId));
                  _push2(ssrRenderComponent(BaseButton, {
                    variant: "primary",
                    size: "md",
                    loading: unref(previewLoading),
                    onClick: loadProductionPreview
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(` Get production price `);
                      } else {
                        return [
                          createTextVNode(" Get production price ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                  _push2(`</div><div class="rounded-3xl border border-slate-200 bg-slate-50 p-5"${_scopeId}><p class="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400"${_scopeId}>Price breakdown</p>`);
                  if (unref(previewData)) {
                    _push2(`<div class="mt-5 space-y-3 rounded-2xl border border-slate-200 bg-white p-5"${_scopeId}><div class="flex items-center justify-between text-sm"${_scopeId}><span class="text-slate-500"${_scopeId}>Production cost</span><span class="font-semibold text-slate-900"${_scopeId}>${ssrInterpolate(formatMoney(unref(productionBase)))}</span></div><div${_scopeId}><label class="text-sm font-semibold text-slate-700"${_scopeId}>Your markup (%)</label><div class="mt-2 flex items-center gap-3"${_scopeId}><input${ssrRenderAttr("value", unref(markupRate))} type="number" min="0" step="1" class="w-28 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"${_scopeId}><span class="text-sm text-slate-500"${_scopeId}>= ${ssrInterpolate(formatMoney(unref(markupAmount)))}</span></div></div><div class="flex items-center justify-between text-sm"${_scopeId}><span class="text-slate-500"${_scopeId}>Printy fee</span><span class="font-semibold text-slate-900"${_scopeId}>${ssrInterpolate(formatMoney(unref(platformFeeAmount)))}</span></div><div class="border-t border-slate-200 pt-3"${_scopeId}><div class="flex items-center justify-between text-base font-bold text-slate-950"${_scopeId}><span${_scopeId}>Client pays</span><span${_scopeId}>${ssrInterpolate(formatMoney(unref(clientTotalAmount)))}</span></div></div></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (unref(previewData)) {
                    _push2(`<p class="mt-4 text-sm text-slate-500"${_scopeId}>Your earnings: ${ssrInterpolate(formatMoney(unref(markupAmount)))}</p>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (unref(previewData)?.summary) {
                    _push2(`<p class="mt-2 text-sm text-slate-500"${_scopeId}>${ssrInterpolate(unref(previewData).summary)}</p>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (unref(selectedPreviewShopLabel)) {
                    _push2(`<p class="mt-2 text-sm text-slate-500"${_scopeId}>Production source: ${ssrInterpolate(unref(selectedPreviewShopLabel))}</p>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (unref(previewWarning)) {
                    _push2(`<p class="mt-4 text-sm font-medium text-amber-700"${_scopeId}>${ssrInterpolate(unref(previewWarning))}</p>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (unref(previewData)) {
                    _push2(`<p class="mt-4 text-xs text-slate-400"${_scopeId}>Final amounts confirmed when quote is created.</p>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (!unref(previewData)) {
                    _push2(`<div class="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500"${_scopeId}> Price preview appears here after the production preview call succeeds. </div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div></div></div>`);
                } else {
                  _push2(`<div class="space-y-6"${_scopeId}><div${_scopeId}><h3 class="text-lg font-semibold text-slate-900"${_scopeId}>Step 3 - Review and send</h3><p class="mt-1 text-sm text-slate-500"${_scopeId}>Confirm the client, specs, and final price before sending.</p></div><div class="rounded-3xl border border-slate-200 bg-slate-50 p-5"${_scopeId}><div class="grid gap-4 md:grid-cols-2"${_scopeId}><div class="rounded-2xl border border-slate-200 bg-white p-4"${_scopeId}><p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400"${_scopeId}>Client</p><p class="mt-2 text-sm font-semibold text-slate-900"${_scopeId}>${ssrInterpolate(unref(reviewClientLabel))}</p></div><div class="rounded-2xl border border-slate-200 bg-white p-4"${_scopeId}><p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400"${_scopeId}>Job</p><p class="mt-2 text-sm font-semibold text-slate-900"${_scopeId}>${ssrInterpolate(unref(reviewJobLabel))}</p></div><div class="rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2"${_scopeId}><p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400"${_scopeId}>Specs</p><p class="mt-2 text-sm font-semibold text-slate-900"${_scopeId}>${ssrInterpolate(unref(reviewSpecsLabel))}</p></div><div class="rounded-2xl border border-slate-200 bg-white p-4"${_scopeId}><p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400"${_scopeId}>Client pays</p><p class="mt-2 text-sm font-semibold text-slate-900"${_scopeId}>${ssrInterpolate(formatMoney(unref(clientTotalAmount)))}</p></div><div class="rounded-2xl border border-slate-200 bg-white p-4"${_scopeId}><p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400"${_scopeId}>Your margin</p><p class="mt-2 text-sm font-semibold text-slate-900"${_scopeId}>${ssrInterpolate(formatMoney(unref(markupAmount)))}</p></div></div></div></div>`);
                }
                _push2(`</div><div class="border-t border-slate-200 px-6 py-4"${_scopeId}><div class="flex flex-wrap items-center justify-between gap-3"${_scopeId}>`);
                if (unref(quotePanelStep) > 1) {
                  _push2(ssrRenderComponent(BaseButton, {
                    variant: "secondary",
                    size: "md",
                    onClick: ($event) => quotePanelStep.value = Math.max(1, unref(quotePanelStep) - 1)
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`Back`);
                      } else {
                        return [
                          createTextVNode("Back")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="ml-auto flex flex-wrap items-center gap-3"${_scopeId}>`);
                if (unref(quotePanelStep) === 1) {
                  _push2(ssrRenderComponent(BaseButton, {
                    variant: "primary",
                    size: "md",
                    loading: unref(clientCreateLoading),
                    disabled: !unref(canContinueStepOne),
                    onClick: continueFromClientStep
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`Continue`);
                      } else {
                        return [
                          createTextVNode("Continue")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                } else if (unref(quotePanelStep) === 2) {
                  _push2(ssrRenderComponent(BaseButton, {
                    variant: "primary",
                    size: "md",
                    disabled: !unref(previewData),
                    onClick: ($event) => quotePanelStep.value = 3
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`Continue`);
                      } else {
                        return [
                          createTextVNode("Continue")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                } else {
                  _push2(ssrRenderComponent(BaseButton, {
                    variant: "primary",
                    size: "md",
                    loading: unref(sendLoading),
                    disabled: !unref(canSendQuote),
                    onClick: submitPartnerQuote
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`Send quote to client`);
                      } else {
                        return [
                          createTextVNode("Send quote to client")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                }
                _push2(`</div></div></div></aside>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--]-->`);
            } else {
              _push2(ssrRenderComponent(DashboardSection, {
                title: unref(sectionTitle),
                subtitle: "Role-specific partner view"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(BaseTable, {
                      columns: unref(columns),
                      rows: unref(rows),
                      loading: unref(loading),
                      "empty-text": unref(emptyText),
                      variant: "dashboard"
                    }, null, _parent3, _scopeId2));
                    if (!unref(loading) && unref(isUiOnly)) {
                      _push3(ssrRenderComponent(DashboardEmptyState, {
                        title: "UI-only section",
                        description: "This route exists, but the backend action set for this section is not implemented yet."
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                  } else {
                    return [
                      createVNode(BaseTable, {
                        columns: unref(columns),
                        rows: unref(rows),
                        loading: unref(loading),
                        "empty-text": unref(emptyText),
                        variant: "dashboard"
                      }, null, 8, ["columns", "rows", "loading", "empty-text"]),
                      !unref(loading) && unref(isUiOnly) ? (openBlock(), createBlock(DashboardEmptyState, {
                        key: 0,
                        title: "UI-only section",
                        description: "This route exists, but the backend action set for this section is not implemented yet."
                      })) : createCommentVNode("", true)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
          } else {
            return [
              unref(pageError) ? (openBlock(), createBlock(BaseAlert, {
                key: 0,
                variant: "error",
                title: "Partner workspace could not load.",
                message: unref(pageError)
              }, null, 8, ["message"])) : unref(toastMessage) ? (openBlock(), createBlock(BaseAlert, {
                key: 1,
                class: "mb-6",
                variant: "success",
                message: unref(toastMessage)
              }, null, 8, ["message"])) : createCommentVNode("", true),
              unref(section) === "quotes" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                createVNode(DashboardPageHeader, {
                  eyebrow: "Partner Quotes",
                  title: "Quotes",
                  subtitle: "Create client-facing quotes from production pricing and track the full brokered workflow."
                }, {
                  actions: withCtx(() => [
                    createVNode(BaseButton, {
                      variant: "primary",
                      size: "md",
                      onClick: openQuotePanel
                    }, {
                      default: withCtx(() => [
                        createTextVNode("New quote")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(DashboardSection, {
                  title: "Quotes",
                  subtitle: "Client | Product | Client pays | Your margin | Status | Date"
                }, {
                  default: withCtx(() => [
                    !unref(quotesLoading) && !unref(quoteRows).length ? (openBlock(), createBlock(DashboardEmptyState, {
                      key: 0,
                      title: "No quotes yet. Create your first quote for a client.",
                      "action-label": "New quote",
                      onClick: openQuotePanel
                    }, {
                      action: withCtx(() => [
                        createVNode(BaseButton, {
                          variant: "secondary",
                          size: "sm",
                          onClick: openQuotePanel
                        }, {
                          default: withCtx(() => [
                            createTextVNode("New quote")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })) : (openBlock(), createBlock(BaseTable, {
                      key: 1,
                      columns: quoteColumns,
                      rows: unref(quoteRows),
                      loading: unref(quotesLoading),
                      "empty-text": "No quotes yet. Create your first quote for a client.",
                      variant: "dashboard",
                      "row-action": openQuoteDetail
                    }, {
                      "cell-status": withCtx(({ value }) => [
                        createVNode("span", {
                          class: ["inline-flex rounded-full px-3 py-1 text-xs font-semibold", statusBadgeClass(value)]
                        }, toDisplayString(partnerStatusLabel(value)), 3)
                      ]),
                      _: 1
                    }, 8, ["rows", "loading"]))
                  ]),
                  _: 1
                }),
                createVNode(Transition, {
                  "enter-active-class": "transition-opacity duration-200",
                  "enter-from-class": "opacity-0",
                  "enter-to-class": "opacity-100",
                  "leave-active-class": "transition-opacity duration-200",
                  "leave-from-class": "opacity-100",
                  "leave-to-class": "opacity-0"
                }, {
                  default: withCtx(() => [
                    unref(quotePanelOpen) ? (openBlock(), createBlock("button", {
                      key: 0,
                      type: "button",
                      class: "fixed inset-0 z-40 bg-slate-950/35",
                      "aria-label": "Close new quote panel",
                      onClick: closeQuotePanel
                    })) : createCommentVNode("", true)
                  ]),
                  _: 1
                }),
                createVNode(Transition, {
                  "enter-active-class": "transform transition duration-300 ease-out",
                  "enter-from-class": "translate-x-full",
                  "enter-to-class": "translate-x-0",
                  "leave-active-class": "transform transition duration-200 ease-in",
                  "leave-from-class": "translate-x-0",
                  "leave-to-class": "translate-x-full"
                }, {
                  default: withCtx(() => [
                    unref(quotePanelOpen) ? (openBlock(), createBlock("aside", {
                      key: 0,
                      class: "fixed right-0 top-0 z-50 flex h-screen w-full max-w-4xl flex-col overflow-hidden border-l border-slate-200 bg-white shadow-2xl"
                    }, [
                      createVNode("div", { class: "flex items-center justify-between border-b border-slate-200 px-6 py-5" }, [
                        createVNode("div", null, [
                          createVNode("p", { class: "text-sm font-medium text-slate-400" }, "Partner Quote Builder"),
                          createVNode("h2", { class: "text-xl font-bold text-slate-900" }, "New quote")
                        ]),
                        createVNode("button", {
                          type: "button",
                          class: "rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600",
                          onClick: closeQuotePanel
                        }, " X ")
                      ]),
                      createVNode("div", { class: "border-b border-slate-200 px-6 py-4" }, [
                        createVNode("div", { class: "flex flex-wrap gap-2" }, [
                          (openBlock(), createBlock(Fragment, null, renderList(quoteStepPills, (pill) => {
                            return createVNode("button", {
                              key: pill.value,
                              type: "button",
                              class: ["rounded-full px-4 py-2 text-sm font-semibold transition-colors", unref(quotePanelStep) === pill.value ? "bg-[#101828] text-white" : "bg-slate-100 text-slate-500"],
                              onClick: ($event) => goToStep(pill.value)
                            }, toDisplayString(pill.label), 11, ["onClick"]);
                          }), 64))
                        ])
                      ]),
                      createVNode("div", { class: "flex-1 overflow-y-auto px-6 py-6" }, [
                        unref(panelError) ? (openBlock(), createBlock(BaseAlert, {
                          key: 0,
                          class: "mb-5",
                          variant: "error",
                          message: unref(panelError)
                        }, null, 8, ["message"])) : createCommentVNode("", true),
                        unref(quotePanelStep) === 1 ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "space-y-6"
                        }, [
                          createVNode("div", null, [
                            createVNode("h3", { class: "text-lg font-semibold text-slate-900" }, "Step 1 - Select client"),
                            createVNode("p", { class: "mt-1 text-sm text-slate-500" }, "Pick an existing client account for this brokered quote.")
                          ]),
                          createVNode("div", { class: "rounded-2xl border border-slate-200 bg-slate-50 p-5" }, [
                            createVNode(BaseInput, {
                              modelValue: unref(clientSearchQuery),
                              "onUpdate:modelValue": ($event) => isRef(clientSearchQuery) ? clientSearchQuery.value = $event : null,
                              label: "Search by name or phone",
                              placeholder: "Search by name or phone",
                              variant: "dashboard"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            unref(clientSearchResults).length ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "mt-3 rounded-2xl border border-slate-200 bg-white"
                            }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(clientSearchResults), (client) => {
                                return openBlock(), createBlock("button", {
                                  key: client.id,
                                  type: "button",
                                  class: "flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50",
                                  onClick: ($event) => selectClient(client)
                                }, [
                                  createVNode("span", { class: "font-semibold text-slate-800" }, toDisplayString(client.name || "Client"), 1),
                                  createVNode("span", { class: "text-sm text-slate-500" }, toDisplayString(client.phone || client.email || `Client #${client.id}`), 1)
                                ], 8, ["onClick"]);
                              }), 128))
                            ])) : createCommentVNode("", true),
                            unref(selectedClient) ? (openBlock(), createBlock("div", {
                              key: 1,
                              class: "mt-4 flex flex-wrap items-center gap-3"
                            }, [
                              createVNode("span", { class: "inline-flex items-center gap-2 rounded-full bg-[#fef3f2] px-4 py-2 text-sm font-semibold text-[#b42318]" }, toDisplayString(unref(selectedClient).name || "Client") + " · " + toDisplayString(unref(selectedClient).phone || unref(selectedClient).email || `Client #${unref(selectedClient).id}`), 1),
                              createVNode("button", {
                                type: "button",
                                class: "text-sm font-semibold text-slate-500",
                                onClick: ($event) => selectedClient.value = null
                              }, " Remove ", 8, ["onClick"])
                            ])) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "rounded-2xl border border-dashed border-slate-300 p-5" }, [
                            createVNode("button", {
                              type: "button",
                              class: "text-sm font-semibold text-[#e13515]",
                              onClick: ($event) => showNewClientForm.value = !unref(showNewClientForm)
                            }, " + New client ", 8, ["onClick"]),
                            unref(showNewClientForm) ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "mt-4 grid gap-4 md:grid-cols-2"
                            }, [
                              createVNode(BaseInput, {
                                modelValue: unref(newClientForm).name,
                                "onUpdate:modelValue": ($event) => unref(newClientForm).name = $event,
                                label: "Name",
                                variant: "dashboard"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              createVNode(BaseInput, {
                                modelValue: unref(newClientForm).phone,
                                "onUpdate:modelValue": ($event) => unref(newClientForm).phone = $event,
                                label: "Phone",
                                variant: "dashboard"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              createVNode(BaseInput, {
                                modelValue: unref(newClientForm).email,
                                "onUpdate:modelValue": ($event) => unref(newClientForm).email = $event,
                                label: "Email",
                                variant: "dashboard"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              createVNode(BaseInput, {
                                modelValue: unref(newClientForm).company,
                                "onUpdate:modelValue": ($event) => unref(newClientForm).company = $event,
                                label: "Company",
                                variant: "dashboard"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ])) : createCommentVNode("", true),
                            unref(showNewClientForm) ? (openBlock(), createBlock("p", {
                              key: 1,
                              class: "mt-3 text-sm text-slate-500"
                            }, " Continue will create or link a client account for this partner, select it, and move to pricing. ")) : createCommentVNode("", true)
                          ])
                        ])) : unref(quotePanelStep) === 2 ? (openBlock(), createBlock("div", {
                          key: 2,
                          class: "space-y-6"
                        }, [
                          createVNode("div", null, [
                            createVNode("h3", { class: "text-lg font-semibold text-slate-900" }, "Step 2 - Job specs + price preview"),
                            createVNode("p", { class: "mt-1 text-sm text-slate-500" }, "Fetch production pricing, then adjust your markup locally.")
                          ]),
                          createVNode("div", { class: "grid gap-6 xl:grid-cols-[1.05fr_0.95fr]" }, [
                            createVNode("div", { class: "space-y-4" }, [
                              createVNode(BaseSelect, {
                                modelValue: unref(quoteSpecs).product_type,
                                "onUpdate:modelValue": ($event) => unref(quoteSpecs).product_type = $event,
                                label: "Product type",
                                options: unref(productTypeOptions),
                                variant: "dashboard"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                              createVNode(BaseSelect, {
                                modelValue: unref(quoteSpecs).finished_size,
                                "onUpdate:modelValue": ($event) => unref(quoteSpecs).finished_size = $event,
                                label: "Size",
                                options: unref(sizeOptions),
                                variant: "dashboard"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                              createVNode(BaseInput, {
                                modelValue: unref(quoteSpecs).quantity,
                                "onUpdate:modelValue": ($event) => unref(quoteSpecs).quantity = $event,
                                type: "number",
                                min: "1",
                                label: "Quantity",
                                variant: "dashboard"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              createVNode(BaseSelect, {
                                modelValue: unref(quoteSpecs).paper_stock,
                                "onUpdate:modelValue": ($event) => unref(quoteSpecs).paper_stock = $event,
                                label: "Paper",
                                options: unref(paperOptions),
                                variant: "dashboard"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                              createVNode(BaseSelect, {
                                modelValue: unref(quoteSpecs).print_sides,
                                "onUpdate:modelValue": ($event) => unref(quoteSpecs).print_sides = $event,
                                label: "Sides",
                                options: sideOptions,
                                variant: "dashboard"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              createVNode(BaseSelect, {
                                modelValue: unref(quoteSpecs).color_mode,
                                "onUpdate:modelValue": ($event) => unref(quoteSpecs).color_mode = $event,
                                label: "Colour mode",
                                options: unref(colorModeOptions),
                                variant: "dashboard"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                              createVNode(BaseSelect, {
                                modelValue: unref(quoteSpecs).lamination,
                                "onUpdate:modelValue": ($event) => unref(quoteSpecs).lamination = $event,
                                label: "Finishing",
                                options: finishingOptions,
                                variant: "dashboard"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              createVNode(BaseSelect, {
                                modelValue: unref(quoteSpecs).urgency_type,
                                "onUpdate:modelValue": ($event) => unref(quoteSpecs).urgency_type = $event,
                                label: "Turnaround",
                                options: turnaroundOptions,
                                variant: "dashboard"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              createVNode(BaseTextarea, {
                                modelValue: unref(quoteSpecs).note,
                                "onUpdate:modelValue": ($event) => unref(quoteSpecs).note = $event,
                                label: "Notes",
                                placeholder: "Optional client-facing note",
                                variant: "dashboard"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              createVNode(BaseButton, {
                                variant: "primary",
                                size: "md",
                                loading: unref(previewLoading),
                                onClick: loadProductionPreview
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Get production price ")
                                ]),
                                _: 1
                              }, 8, ["loading"])
                            ]),
                            createVNode("div", { class: "rounded-3xl border border-slate-200 bg-slate-50 p-5" }, [
                              createVNode("p", { class: "text-sm font-semibold uppercase tracking-[0.16em] text-slate-400" }, "Price breakdown"),
                              unref(previewData) ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "mt-5 space-y-3 rounded-2xl border border-slate-200 bg-white p-5"
                              }, [
                                createVNode("div", { class: "flex items-center justify-between text-sm" }, [
                                  createVNode("span", { class: "text-slate-500" }, "Production cost"),
                                  createVNode("span", { class: "font-semibold text-slate-900" }, toDisplayString(formatMoney(unref(productionBase))), 1)
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", { class: "text-sm font-semibold text-slate-700" }, "Your markup (%)"),
                                  createVNode("div", { class: "mt-2 flex items-center gap-3" }, [
                                    withDirectives(createVNode("input", {
                                      "onUpdate:modelValue": ($event) => isRef(markupRate) ? markupRate.value = $event : null,
                                      type: "number",
                                      min: "0",
                                      step: "1",
                                      class: "w-28 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                                    }, null, 8, ["onUpdate:modelValue"]), [
                                      [vModelText, unref(markupRate)]
                                    ]),
                                    createVNode("span", { class: "text-sm text-slate-500" }, "= " + toDisplayString(formatMoney(unref(markupAmount))), 1)
                                  ])
                                ]),
                                createVNode("div", { class: "flex items-center justify-between text-sm" }, [
                                  createVNode("span", { class: "text-slate-500" }, "Printy fee"),
                                  createVNode("span", { class: "font-semibold text-slate-900" }, toDisplayString(formatMoney(unref(platformFeeAmount))), 1)
                                ]),
                                createVNode("div", { class: "border-t border-slate-200 pt-3" }, [
                                  createVNode("div", { class: "flex items-center justify-between text-base font-bold text-slate-950" }, [
                                    createVNode("span", null, "Client pays"),
                                    createVNode("span", null, toDisplayString(formatMoney(unref(clientTotalAmount))), 1)
                                  ])
                                ])
                              ])) : createCommentVNode("", true),
                              unref(previewData) ? (openBlock(), createBlock("p", {
                                key: 1,
                                class: "mt-4 text-sm text-slate-500"
                              }, "Your earnings: " + toDisplayString(formatMoney(unref(markupAmount))), 1)) : createCommentVNode("", true),
                              unref(previewData)?.summary ? (openBlock(), createBlock("p", {
                                key: 2,
                                class: "mt-2 text-sm text-slate-500"
                              }, toDisplayString(unref(previewData).summary), 1)) : createCommentVNode("", true),
                              unref(selectedPreviewShopLabel) ? (openBlock(), createBlock("p", {
                                key: 3,
                                class: "mt-2 text-sm text-slate-500"
                              }, "Production source: " + toDisplayString(unref(selectedPreviewShopLabel)), 1)) : createCommentVNode("", true),
                              unref(previewWarning) ? (openBlock(), createBlock("p", {
                                key: 4,
                                class: "mt-4 text-sm font-medium text-amber-700"
                              }, toDisplayString(unref(previewWarning)), 1)) : createCommentVNode("", true),
                              unref(previewData) ? (openBlock(), createBlock("p", {
                                key: 5,
                                class: "mt-4 text-xs text-slate-400"
                              }, "Final amounts confirmed when quote is created.")) : createCommentVNode("", true),
                              !unref(previewData) ? (openBlock(), createBlock("div", {
                                key: 6,
                                class: "mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500"
                              }, " Price preview appears here after the production preview call succeeds. ")) : createCommentVNode("", true)
                            ])
                          ])
                        ])) : (openBlock(), createBlock("div", {
                          key: 3,
                          class: "space-y-6"
                        }, [
                          createVNode("div", null, [
                            createVNode("h3", { class: "text-lg font-semibold text-slate-900" }, "Step 3 - Review and send"),
                            createVNode("p", { class: "mt-1 text-sm text-slate-500" }, "Confirm the client, specs, and final price before sending.")
                          ]),
                          createVNode("div", { class: "rounded-3xl border border-slate-200 bg-slate-50 p-5" }, [
                            createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                              createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white p-4" }, [
                                createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-slate-400" }, "Client"),
                                createVNode("p", { class: "mt-2 text-sm font-semibold text-slate-900" }, toDisplayString(unref(reviewClientLabel)), 1)
                              ]),
                              createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white p-4" }, [
                                createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-slate-400" }, "Job"),
                                createVNode("p", { class: "mt-2 text-sm font-semibold text-slate-900" }, toDisplayString(unref(reviewJobLabel)), 1)
                              ]),
                              createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2" }, [
                                createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-slate-400" }, "Specs"),
                                createVNode("p", { class: "mt-2 text-sm font-semibold text-slate-900" }, toDisplayString(unref(reviewSpecsLabel)), 1)
                              ]),
                              createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white p-4" }, [
                                createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-slate-400" }, "Client pays"),
                                createVNode("p", { class: "mt-2 text-sm font-semibold text-slate-900" }, toDisplayString(formatMoney(unref(clientTotalAmount))), 1)
                              ]),
                              createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white p-4" }, [
                                createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-slate-400" }, "Your margin"),
                                createVNode("p", { class: "mt-2 text-sm font-semibold text-slate-900" }, toDisplayString(formatMoney(unref(markupAmount))), 1)
                              ])
                            ])
                          ])
                        ]))
                      ]),
                      createVNode("div", { class: "border-t border-slate-200 px-6 py-4" }, [
                        createVNode("div", { class: "flex flex-wrap items-center justify-between gap-3" }, [
                          unref(quotePanelStep) > 1 ? (openBlock(), createBlock(BaseButton, {
                            key: 0,
                            variant: "secondary",
                            size: "md",
                            onClick: ($event) => quotePanelStep.value = Math.max(1, unref(quotePanelStep) - 1)
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Back")
                            ]),
                            _: 1
                          }, 8, ["onClick"])) : createCommentVNode("", true),
                          createVNode("div", { class: "ml-auto flex flex-wrap items-center gap-3" }, [
                            unref(quotePanelStep) === 1 ? (openBlock(), createBlock(BaseButton, {
                              key: 0,
                              variant: "primary",
                              size: "md",
                              loading: unref(clientCreateLoading),
                              disabled: !unref(canContinueStepOne),
                              onClick: continueFromClientStep
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Continue")
                              ]),
                              _: 1
                            }, 8, ["loading", "disabled"])) : unref(quotePanelStep) === 2 ? (openBlock(), createBlock(BaseButton, {
                              key: 1,
                              variant: "primary",
                              size: "md",
                              disabled: !unref(previewData),
                              onClick: ($event) => quotePanelStep.value = 3
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Continue")
                              ]),
                              _: 1
                            }, 8, ["disabled", "onClick"])) : (openBlock(), createBlock(BaseButton, {
                              key: 2,
                              variant: "primary",
                              size: "md",
                              loading: unref(sendLoading),
                              disabled: !unref(canSendQuote),
                              onClick: submitPartnerQuote
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Send quote to client")
                              ]),
                              _: 1
                            }, 8, ["loading", "disabled"]))
                          ])
                        ])
                      ])
                    ])) : createCommentVNode("", true)
                  ]),
                  _: 1
                })
              ], 64)) : (openBlock(), createBlock(DashboardSection, {
                key: 3,
                title: unref(sectionTitle),
                subtitle: "Role-specific partner view"
              }, {
                default: withCtx(() => [
                  createVNode(BaseTable, {
                    columns: unref(columns),
                    rows: unref(rows),
                    loading: unref(loading),
                    "empty-text": unref(emptyText),
                    variant: "dashboard"
                  }, null, 8, ["columns", "rows", "loading", "empty-text"]),
                  !unref(loading) && unref(isUiOnly) ? (openBlock(), createBlock(DashboardEmptyState, {
                    key: 0,
                    title: "UI-only section",
                    description: "This route exists, but the backend action set for this section is not implemented yet."
                  })) : createCommentVNode("", true)
                ]),
                _: 1
              }, 8, ["title"]))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/partner/[section].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_section_-ELMC3baV.mjs.map
