'use strict';

module.exports = {
    view: function (data, classNames) {
        //Don't make an single `` block as minification cannot compress down
        //Instead use +
        return `<div class="${classNames.item} ${data.highlighted ? classNames.highlightedState : classNames.itemSelectable}" data-item data-id="${data.id}" data-value="${data.value}" ${data.active ? 'aria-selected="true"' : ''} ${data.disabled ? 'aria-disabled="true"' : ''}>` +
            `${data.value.indexOf('us') === 0 ? '<div class="us-flag"></div>' : ''}` +
            `${data.value.indexOf('eu-west-2') === 0 ? '<div class="gb-flag"></div>' : ''}` +
            `${data.value.indexOf('ca') === 0 ? '<div class="ca-flag"></div>' : ''}` +
            `${data.value.indexOf('eu-west-1') === 0 ? '<div class="ie-flag"></div>' : ''}` +
            `${data.value.indexOf('eu-central-1') === 0 ? '<div class="de-flag"></div>' : ''}` +
            `${data.value.indexOf('ap-northeast-1') === 0 ? '<div class="jp-flag"></div>' : ''}` +
            `${data.value.indexOf('ap-southeast-2') === 0 ? '<div class="au-flag"></div>' : ''}` +
            `${data.value.indexOf('ap-northeast-2') === 0 ? '<div class="kr-flag"></div>' : ''}` +
            `${data.value.indexOf('ap-southeast-1') === 0 ? '<div class="sg-flag"></div>' : ''}` +
            `${data.value.indexOf('ap-south-1') === 0 ? '<div class="in-flag"></div>' : ''}` +
            `${data.value.indexOf('sa-east-1') === 0 ? '<div class="br-flag"></div>' : ''}` +
            `${data.label}` +
          `</div>`;
    }
};