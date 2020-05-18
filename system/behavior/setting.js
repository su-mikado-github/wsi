/**
 *
 */
WSI.screendef(function Userlist() {
	WSI.Screen.call(this);

	var _base = this.base();
	var _this = this;

	var ETypes = system.ETypes;

	var _attribute_types = [];

//	_this.mapping();

	var _division = null;
	var _divisionValues = null;

	var _attributeTypeMap = {};

	var _division1 = null;
	var _division2 = null;
	var _division3 = null;

	var _editing = null;

	function selectDivision1Type(division1) {
		_this.controls.txtDefaultDivision1Value.clear();
		_this.controls.txtDefaultDivision2Value.clear();
		_this.controls.txtDefaultDivision3Value.clear();
		division1.forEach(function(item, index) {
			_this.controls.txtDefaultDivision1Value.append(
				WSI.tag("option").value(item.division_id).text(item.division_name)
			);
		});
	}

	function selectDivision2Type(division2) {
		_this.controls.txtDefaultDivision1Value.clear();
		_this.controls.txtDefaultDivision2Value.clear();
		_this.controls.txtDefaultDivision3Value.clear();
	}

	function selectDivision3Type(division3) {
		_this.controls.txtDefaultDivision1Value.clear();
		_this.controls.txtDefaultDivision2Value.clear();
		_this.controls.txtDefaultDivision3Value.clear();
	}

	function changeAttributeType(type_no) {
		_this.controls.txtDefaultStringValue.styleClass(type_no==ETypes.String ? {add:"d-inline",remove:"d-none"} : {add:"d-none",remove:"d-inline"});
		_this.controls.txtDefaultTextValue.styleClass(type_no==ETypes.Text ? {add:"d-inline",remove:"d-none"} : {add:"d-none",remove:"d-inline"});
		_this.controls.txtDefaultIntValue.styleClass(type_no==ETypes.Integer ? {add:"d-inline",remove:"d-none"} : {add:"d-none",remove:"d-inline"});
		_this.controls.txtDefaultDoubleValue.styleClass(type_no==ETypes.Double ? {add:"d-inline",remove:"d-none"} : {add:"d-none",remove:"d-inline"});
		_this.controls.txtDefaultDateValue.styleClass(type_no==ETypes.Date || type_no==ETypes.DateTime ? {add:"d-inline",remove:"d-none"} : {add:"d-none",remove:"d-inline"});
		_this.controls.txtDefaultTimeValue.styleClass(type_no==ETypes.Time || type_no==ETypes.DateTime ? {add:"d-inline",remove:"d-none"} : {add:"d-none",remove:"d-inline"});
		_this.controls.txtDefaultFlagValue.styleClass(type_no==ETypes.Flag ? {add:"d-inline",remove:"d-none"} : {add:"d-none",remove:"d-inline"});
		_this.controls.txtDefaultDivision1Value.styleClass(type_no==ETypes.Division1 || type_no==ETypes.Division2 || type_no==ETypes.Division3 ? {add:"d-inline",remove:"d-none"} : {add:"d-none",remove:"d-inline"});
		_this.controls.txtDefaultDivision2Value.styleClass(type_no==ETypes.Division2 || type_no==ETypes.Division3 ? {add:"d-inline",remove:"d-none"} : {add:"d-none",remove:"d-inline"});
		_this.controls.txtDefaultDivision3Value.styleClass(type_no==ETypes.Division3 ? {add:"d-inline",remove:"d-none"} : {add:"d-none",remove:"d-inline"});

		if (type_no == ETypes.Division1) {
			selectDivision1Type(_division1);
		}
		else if (type_no == ETypes.Division2) {
			selectDivision2Type(_division2);
		}
		else if (type_no == ETypes.Division3) {
			selectDivision3Type(_division3);
		}
	}

	function buildSelectDataType(control, division, divisionValues, type_no) {
		control.clear();
		for (var i in divisionValues) {
			var divisionValue = divisionValues[i];
			control.append(
				WSI.tag("option").data("division_value_id", divisionValue.division_value_id).value(divisionValue.division_int_value).text(divisionValue.division_value_name)
			);
		}
		return control;
	}

	function btnUp_click(e) {
		console.log("up");
	}

	function btnDown_click(e) {
		console.log("down");
	}

	function btnRemove_click(e) {
		var tr = WSI.tag(e.target).parent().parent();
		var tbody = tr.parent();

		var rowIndex = tr.data("row_index") || 0;
		_attribute_types[rowIndex] = null;

		tbody.remove(tr);
		normalizeList(tbody.finds("tr"));
	}

	function updateRow(tr, row) {
		var rowIndex = tr.data("row_index") || 0;
		var attributeType = _attribute_types[rowIndex];

		tr.find("[data-name=name]").text(row.name);
		tr.find("[data-name=type]").data("division_value_id", _attributeTypeMap[row.type_no].division_value_id).text(_attributeTypeMap[row.type_no].division_value_name);
		tr.find("[data-name=value]").text(row.value);
		tr.find("[data-name=visible]").text(row.visibled ? "○" : "　").data("visibled", (row.visibled ? 1 : 0));
		_attribute_types[rowIndex] = row;
		return tr;
	}

	function buildRow(row) {
		return WSI.tag("tr")
			.data("attribute_type_id", row.id)
			.data("row_index", row.index)
			.append(WSI.tag("td").data("name", "name").styleClass("align-middle").text(row.name))
			.append(WSI.tag("td").data("name", "type").styleClass("align-middle").data("division_value_id", _attributeTypeMap[row.type_no].division_value_id).text(_attributeTypeMap[row.type_no].division_value_name))
			.append(WSI.tag("td").data("name", "value").styleClass("align-middle").text(function() {
				var result = "";
				if (row.value) {
					if (typeof(row.value) === "object") {
						if (typeof(row.value.division_id)) {
							result += row.value.division_id;
						}
						if (typeof(row.value.layer2_division_id)) {
							result = result + (!result.length ? row.value.layer2_division_id : "／"+row.value.layer2_division_id);
						}
						if (typeof(row.value.layer3_division_id)) {
							result = result + (!result.length ? row.value.layer3_division_id : "／"+row.value.layer3_division_id);
						}
					}
					else {
						result = row.value;
					}
				}
				return result;
			}))
			.append(WSI.tag("td").data("name", "visible").styleClass("text-center align-middle").text(row.visibled ? "○" : "　")).data("visibled", (row.visibled ? 1 : 0))
			.append(WSI.tag("td").append(
				WSI.tag("div").styleClass("form-group row m-0 p-0").append([
					WSI.tag("button").data("name", "up").attr("type", "button").styleClass("btn btn-outline-secondary invisible form-control w-50").text("↑").click(btnUp_click),
					WSI.tag("button").data("name", "down").attr("type", "button").styleClass("btn btn-outline-secondary invisible form-control w-50").text("↓").click(btnDown_click),
				])
			))
			.append(WSI.tag("td").append(
				WSI.tag("button").data("name", "remove").attr("type", "button").styleClass("btn btn-outline-danger form-control").styleClass({add:"invisible"}, row.id!=="*").text("削除").click(btnRemove_click)
			))
		;
	}

	function rowEdit(tr) {
		var rowIndex = tr.data("row_index") || 0;
		var attributeType = _attribute_types[rowIndex];

		_this.controls.txtAttributeName.value(attributeType.name);
		_this.controls.selAttributeType.value(attributeType.type_no);
		changeAttributeType(_this.controls.selAttributeType.value());
//		_this.controls.txtDefaultValue.value(attributeType.value);
		_this.controls.chkVisibled.checked(attributeType.visibled);

		return tr;
	}

	function normalizeList(trList) {
		trList.forEach(function(tr, i) {
			var up = tr.find("[data-name=up]");
			var down = tr.find("[data-name=down]");
			if (i === 0) {
				up.styleClass({add:"invisible"});
				down.styleClass({remove:"invisible"}, (1 < trList.length));
			}
			else if (i+1 === trList.length) {
				up.styleClass({remove:"invisible"}, (1 < trList.length));
				down.styleClass({add:"invisible"});
			}
			else {
				up.styleClass({remove:"invisible"});
				down.styleClass({remove:"invisible"});
			}
		});
	}

	function getAttributeValue(attribute) {
		var type_no = attribute.attribute_type;
		switch (type_no) {
		case ETypes.String:
			return attribute.default_string_value;
		case ETypes.Text:
			return attribute.default_text_value;
		case ETypes.Integer:
			return attribute.default_int_value;
		case ETypes.Double:
			return attribute.default_double_value;
		case ETypes.Date:
			return attribute.default_date_value;
		case ETypes.DateTime:
			return attribute.default_datetime_value;
		case ETypes.Time:
			return attribute.default_time_value;
		case ETypes.Flag:
			return attribute.default_flag_value;
		case ETypes.Division1:
			return {
				value_id: attribute.default_value_id,
				division_id: attribute.division_id,
			};
		case ETypes.Division2:
			return {
				value_id: attribute.default_value_id,
				division_id: attribute.division_id,
				layer2_division_id: attribute.layer2_division_id,
			};
		case ETypes.Division3:
			return {
				value_id: attribute.default_value_id,
				division_id: attribute.division_id,
				layer2_division_id: attribute.layer2_division_id,
				layer3_division_id: attribute.layer3_division_id,
			};
		}
		return null;
	}

	function clearInput() {

		_this.controls.txtAttributeName.value(null);
		_this.controls.selAttributeType.value(_division.division_int_value);
		changeAttributeType(_this.controls.selAttributeType.value());
		_this.controls.txtDefaultStringValue.value(null);
		_this.controls.txtDefaultTextValue.value(null);
		_this.controls.txtDefaultIntValue.value(null);
		_this.controls.txtDefaultDoubleValue.value(null);
		_this.controls.txtDefaultDateValue.value(null);
		_this.controls.txtDefaultTimeValue.value(null);
		_this.controls.txtDefaultFlagValue.checked(false);
		_this.controls.txtDefaultDivision1Value.value(null);
		_this.controls.txtDefaultDivision2Value.value(null);
		_this.controls.txtDefaultDivision3Value.value(null);
		_this.controls.chkVisibled.checked(true);

		_this.controls.btnUpdate.styleClass({add:"invisible"});
		_editing = null;
	}

	_this.initialize = function initialize() {
		_base.initialize();

		WSI.method("<?=url('/system/setting.json') ?>", null, null, function(result) {
			console.log(JSON.stringify(result));

			_division = result.params.division;
			_divisionValues = result.params.division_values;

			_division1 = result.params.division1;
			_division2 = result.params.division2;
			_division3 = result.params.division3;

			_attributeTypeMap = {};
			_divisionValues.forEach(function(v) {
				_attributeTypeMap[v.division_int_value] = v;
			});

			buildSelectDataType(_this.controls.selAttributeType, _division, _divisionValues, _division.division_int_value);
			changeAttributeType(_this.controls.selAttributeType.value());

			var tbody = _this.controls.tblAttributeList.find("tbody");

			_attribute_types = [];
			for (var i in result.params.list) {
				var item = result.params.list[i];

				var row = {
					index: _attribute_types.length,
					id: item.attribute_type_id,
					name: item.attribute_type_name,
					type_no: item.attribute_type,
					value: getAttributeValue(item),
					visibled: !item.delete_flag,
				};
				tbody.append(buildRow(row));
				_attribute_types.push(row);

				normalizeList(tbody.finds("tr"));
			}

			clearInput();
		});

		_this.controls.selAttributeType.change(function(e) {
			var type_no = WSI.tag(e.target).value();
			changeAttributeType(type_no);
		});

		_this.controls.tblAttributeList.click(function(e) {
			//
			if (e.target.tagName === "TD") {
				var tr = rowEdit(WSI.tag(e.target).parent());
				_this.controls.btnUpdate.styleClass({remove:"invisible"});
				_editing = tr;
			}
		});

		_this.controls.btnAppend.click(function(e) {
			var tbody = _this.controls.tblAttributeList.find("tbody");

			var row = {
				index: _attribute_types.length,
				id: "*",
				name: _this.controls.txtAttributeName.value(),
				type_no: _this.controls.selAttributeType.value(),
				value: null, // _this.controls.txtDefaultValue.value(),
				visibled: _this.controls.chkVisibled.checked(),
			};
			tbody.append(buildRow(row));
			_attribute_types.push(row);

			normalizeList(tbody.finds("tr"));

			clearInput();
		});

		_this.controls.btnUpdate.click(function(e) {
			if (_editing) {
				var row = {
					index: _attribute_types.length,
					id: "*",
					name: _this.controls.txtAttributeName.value(),
					type_no: _this.controls.selAttributeType.value(),
					value: null, //_this.controls.txtDefaultValue.value(),
					visibled: _this.controls.chkVisibled.checked(),
				};

				updateRow(_editing, row);

				clearInput();
			}
		});

		_this.on("message.save", function(e) {
			_this.message("saved");
		});

		_this.message("ready");
	};
});
