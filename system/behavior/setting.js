/**
 *
 */
WSI.screendef(function Userlist() {
	WSI.Screen.call(this);

	var _base = this.base();
	var _this = this;

	var _attribute_types = [];

//	_this.mapping();

	var _division = null;
	var _divisionValues = null;

	var _attributeTypeMap = {};

	var _editing = null;

//	function buildSelectDataType(division, divisionValues, type_no) {
//		var result = WSI.tag("select")
//			.styleClass("form-control")
//		for (var i in divisionValues) {
//			var divisionValue = divisionValues[i];
//			result.append(
//				WSI.tag("option").attr("selected", (divisionValue.division_int_value==type_no)).data("division_value_id", divisionValue.division_value_id).value(divisionValue.division_int_value).text(divisionValue.division_value_name)
//			);
//		}
//		return result;
//	}

	function buildSelectDataType(control, division, divisionValues, type_no) {
		control.clear();
		for (var i in divisionValues) {
			var divisionValue = divisionValues[i];
			control.append(
				WSI.tag("option").attr("selected", (divisionValue.division_int_value==type_no)).data("division_value_id", divisionValue.division_value_id).value(divisionValue.division_int_value).text(divisionValue.division_value_name)
			);
		}
		return control;
	}

//	function buildValue(type, value) {
//		switch (type) {
//		case:
//		}
//	}

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
			.append(WSI.tag("td").data("name", "value").styleClass("align-middle").text(row.value))
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
		_this.controls.txtDefaultValue.value(attributeType.value);
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

	_this.initialize = function initialize() {
		_base.initialize();

		WSI.method("<?=url('/system/setting.json') ?>", null, null, function(result) {
			console.log(JSON.stringify(result));

			_division = result.params.division;
			_divisionValues = result.params.division_values;

			_attributeTypeMap = {};
			_divisionValues.forEach(function(v) {
				_attributeTypeMap[v.division_int_value] = v;
			});

			buildSelectDataType(_this.controls.selAttributeType, _division, _divisionValues, _division.default_int_value);

			var tbody = _this.controls.tblAttributeList.find("tbody");

			_attribute_types = [];
			for (var i in result.params.list) {
				var item = result.params.list[i];

				var row = {
					index: _attribute_types.length,
					id: item.attribute_type_id,
					name: item.attribute_type_name,
					type_no: item.attribute_type,
					value: "",
					delete_flag: false,
				};

				_attribute_types.push(row);
				tbody.append(
					WSI.tag("tr")
						.data("attribute_type_id", row.attribute_type_id)
						.append(WSI.tag("td").append(
								WSI.tag("input").attr("type", "checkbox").styleClass("form-control").value(row.attribute_type_id)
						))
						.append(WSI.tag("td").append(buildSelectDataType(_division, _divisionValues)))
						.append(WSI.tag("td").append(
								WSI.tag("input").attr("type", "text").styleClass("form-control")
						))
						.append(WSI.tag("td").append(
								WSI.tag("input").attr("type", "checkbox").styleClass("form-control").value(row.attribute_type_id).attr("checked", row.delete_flag!==0)
						))
				);
			}
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
				value: _this.controls.txtDefaultValue.value(),
				visibled: _this.controls.chkVisibled.checked(),
			};
			tbody.append(buildRow(row));
			_attribute_types.push(row);

			normalizeList(tbody.finds("tr"));

			_this.controls.txtAttributeName.value(null);
			_this.controls.selAttributeType.value(_division.division_int_value);
			_this.controls.txtDefaultValue.value(null);
			_this.controls.chkVisibled.checked(true);

			_this.controls.btnUpdate.styleClass({add:"invisible"});
			_editing = null;
		});

		_this.controls.btnUpdate.click(function(e) {
			if (_editing) {
				var row = {
					index: _attribute_types.length,
					id: "*",
					name: _this.controls.txtAttributeName.value(),
					type_no: _this.controls.selAttributeType.value(),
					value: _this.controls.txtDefaultValue.value(),
					visibled: _this.controls.chkVisibled.checked(),
				};

				updateRow(_editing, row);

				_this.controls.txtAttributeName.value(null);
				_this.controls.selAttributeType.value(_division.division_int_value);
				_this.controls.txtDefaultValue.value(null);
				_this.controls.chkVisibled.checked(true);

				_this.controls.btnUpdate.styleClass({add:"invisible"});
				_editing = null;
			}
		});

		_this.on("message.save", function(e) {
			_this.message("saved");
		});

		_this.message("ready");
	};
});
