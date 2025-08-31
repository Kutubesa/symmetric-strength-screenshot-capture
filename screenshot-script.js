// ==UserScript==
// @name			Symmetric Strength Capture
// @version			1
// @grant			none
// @require			https://code.jquery.com/jquery-3.6.0.min.js
// @match			https://symmetricstrength.com/
// @run-at			document-end
// ==/UserScript==

window.addEventListener("load", function() {
	main();
});

function main() {

	const weights = $('.container [role="form"] .col-md-12');
	const buttonContainer = weights.find(".btn.btn-lg").parent();

	const archBtn = $('<button>Prepare For Archiving</button>');
	archBtn.addClass('btn btn-lg ng-binding');
	archBtn.css({
		color: '#fff',
		'background-color': '#6a6ae2'
	})
	buttonContainer.append(archBtn);
	archBtn.on('click', function() {
		const score = $('.dashboard-stat');
		const orm = $('.one-rep-maxes');
		const rel = $('#strengths-and-weaknesses-chart');
		const muscle = $('muscle-figure #canvas-container');
		const legend = $('.muscle-figure-legend .list-unstyled');

		const elements = [
			{name: 'Score Dashboard', el: score},
			{name: 'Estimated One Rep Maxes', el: orm},
			{name: 'Relative Strengths and Weaknesses', el: rel},
			{name: 'Muscle Groups Picture', el: muscle},
			{name: 'Muscle Groups Legend', el: legend}
		];
		const missing = elements
			.filter(obj => !obj.el.length || !obj.el.is(':visible'))
			.map(obj => obj.name);

		// prompt if missing elements
		if (missing.length) {
			console.log(missing);
			alert(`Missing elements. Click Analyze Strength and try again.`);
			return;
		}

		const lifterInfo = weights.find('.lifter-info');
		const stats = weights.find('.animate-fade.ng-scope');

		const background = $('<div></div>');
		background.css({
			position: 'fixed',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			opacity: 0.5,
			'background-color': '#000000',
			'z-index': 999
		});
		$('body').append(background);

		const viewContainer = $('<div></div>');
		viewContainer.css({
			position: 'absolute',
			width: 'auto',
			height: 'auto',
			display: 'block',
			'background-color': '#ffffff',
			padding: '25px',
			'z-index': 1000
		});
		$('body').append(viewContainer);

		const closeBtn = $('<button>&times;</button>').css({
			position: 'absolute',
			top: '0px',
			right: '0px',
			border: 'none',
			background: 'transparent',
			fontSize: '30px',
			height: '30px',
			width: '30px',
			'line-height': '30px',
			padding: 0,
			'text-align': 'center',
			cursor: 'pointer',
			'z-index': 1
		});
		$(viewContainer).append(closeBtn);

		background.on('click', function() {
			background.remove();
			viewContainer.remove();
		});
		closeBtn.on('click', function() {
			background.remove();
			viewContainer.remove();
		});

		assembleElements(
			viewContainer,
			lifterInfo.clone(true, true),
			stats.clone(true, true),
			score.clone(true, true),
			orm.clone(true, true),
			rel,
			rel.clone(true, true),
			muscle.clone(true, true),
			legend.clone(true, true)
		);
	});
}

function assembleElements(viewContainer, lifterInfo, stats, score, orm, relOriginal, rel, muscle, legend) {
	const bigColumns = $('<div></div>');
	bigColumns.css({
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-start',
		border: '2px solid #e3e3e3',
		'border-radius': '10px',
		overflow: 'hidden',
		padding: '30px 10px 0'
	});
	viewContainer.append(bigColumns);
	const col1 = $('<div></div>');
	col1.css({
		'max-width': '700px',
		'z-index': 1
	});

	lifterInfo.css({
		padding: '0px 0px 30px 10px',
		margin: '-10px 0px 0px'
	});
	lifterInfo.find('label').css({margin: '-20px 0px auto'});
	lifterInfo.children().each(function() {
		$(this).css({width: '30%'});
	});
	col1.append(lifterInfo);

	col1.find('.form-group').css({padding: '0 5px', margin: 0});
	stats.slice(1).each(function() {
		$(this).find('label').html('');
	});
	stats.each(function() {
		$(this).find('.form-group').css({padding: '0 5px', margin: 0, width: '30%'});
		$(this).find('.col-md-2').css({width: '30%'});
		$(this).find('.lift-title').css({padding: '10px 5px', margin: 0});
		if ($(this).find('.form-group').length === 3) {
			$(this).find('.form-group').css({width: '20%'});
		}
		col1.append($(this));
	});

	const smallColumns = $('<div></div>');
	smallColumns.css({
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		margin: '10px 0px -3px'
	});
	score.css({position: 'relative', margin: 0})
	smallColumns.append(score);
	orm.css({margin: 0})
	smallColumns.append(orm);
	smallColumns.append(legend);
	col1.append(smallColumns);

	// fix relative strenghts chart
	const originalCanvas = relOriginal.find('canvas')[0];
	const cloneCanvas = rel.find('canvas')[0];
	cloneCanvas.width = originalCanvas.width;
	cloneCanvas.height = originalCanvas.height;
	const ctx = cloneCanvas.getContext('2d');
	ctx.drawImage(originalCanvas, 0, 0);
	rel.css({
		border: 'none',
		margin: '0 -30px -40px -15px'
	});
	rel.children().each(function() {
		$(this).css({
			'margin-bottom': '-30px'
		});
		$(this).children().each(function() {
			$(this).css({
				'margin-bottom': '-30px'
			});
		});
	});
	col1.append(rel);

	bigColumns.append(col1);

	muscle.css({margin: '-30px -50px'});
	bigColumns.append(muscle);

	// set container placement
	const scrollX = window.scrollX;
	const scrollY = window.scrollY;
	const screenW = window.innerWidth;
	const screenH = window.innerHeight;

	const containerW = viewContainer.outerWidth();
	const containerH = viewContainer.outerHeight();

	const left = scrollX + (screenW - containerW) / 2;
	const top  = scrollY + (screenH - containerH) / 2;
	
	viewContainer.css({
		left: `${left}px`,
		top: `${top}px`
	});
}
